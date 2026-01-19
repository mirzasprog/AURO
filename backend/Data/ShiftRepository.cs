using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Entities;
using backend.Models;
using backend.Models.Shifts;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Data
{
    public class ShiftRepository : IShiftRepository
    {
        private const string StatusDraft = "Draft";
        private const string StatusPublished = "Published";
        private const string StatusCompleted = "Completed";
        private const string StatusCancelled = "Cancelled";
        private const string RequestStatusPending = "Pending";
        private const string RequestStatusApproved = "Approved";
        private const string RequestStatusRejected = "Rejected";
        private const string RoleStore = "prodavnica";
        private const string RoleRegional = "regionalni";
        private const string RolePodrucni = "podrucni";
        private const string RoleAdmin = "uprava";

        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ShiftOptions _options;
        private Korisnik? _currentUser;

        public ShiftRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor, IOptions<ShiftOptions> options)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _options = options.Value;
        }

        public async Task<PagedResult<ShiftDto>> GetShiftsAsync(ShiftQueryParameters parameters)
        {
            var resolvedStoreId = await ResolveStoreIdAsync(parameters.StoreId);

            var query = _context.Shift
                .AsNoTracking()
                .Include(s => s.Store)
                .Where(s => !s.IsDeleted);

            if (resolvedStoreId.HasValue)
            {
                query = query.Where(s => s.StoreId == resolvedStoreId.Value);
            }

            if (parameters.From.HasValue)
            {
                var fromDate = parameters.From.Value.Date;
                query = query.Where(s => s.ShiftDate >= fromDate);
            }

            if (parameters.To.HasValue)
            {
                var toDate = parameters.To.Value.Date;
                query = query.Where(s => s.ShiftDate <= toDate);
            }

            if (parameters.EmployeeId.HasValue)
            {
                query = query.Where(s => s.EmployeeId == parameters.EmployeeId.Value);
            }

            if (!string.IsNullOrWhiteSpace(parameters.Status))
            {
                query = query.Where(s => s.Status == parameters.Status);
            }

            var total = await query.CountAsync();
            var page = Math.Max(parameters.Page, 1);
            var pageSize = Math.Clamp(parameters.PageSize, 1, 200);

            var items = await query
                .OrderBy(s => s.ShiftDate)
                .ThenBy(s => s.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var importLookup = await GetImportedEmployeeLookupAsync(items.Select(item => item.EmployeeId));

            return new PagedResult<ShiftDto>
            {
                Items = items.Select(item => MapShift(item, importLookup)).ToList(),
                TotalCount = total
            };
        }

        public async Task<IEnumerable<ShiftDto>> GetShiftsForExportAsync(ShiftQueryParameters parameters)
        {
            var resolvedStoreId = await ResolveStoreIdAsync(parameters.StoreId);

            var query = _context.Shift
                .AsNoTracking()
                .Include(s => s.Store)
                .Where(s => !s.IsDeleted);

            if (resolvedStoreId.HasValue)
            {
                query = query.Where(s => s.StoreId == resolvedStoreId.Value);
            }

            if (parameters.From.HasValue)
            {
                var fromDate = parameters.From.Value.Date;
                query = query.Where(s => s.ShiftDate >= fromDate);
            }

            if (parameters.To.HasValue)
            {
                var toDate = parameters.To.Value.Date;
                query = query.Where(s => s.ShiftDate <= toDate);
            }

            if (parameters.EmployeeId.HasValue)
            {
                query = query.Where(s => s.EmployeeId == parameters.EmployeeId.Value);
            }

            if (!string.IsNullOrWhiteSpace(parameters.Status))
            {
                query = query.Where(s => s.Status == parameters.Status);
            }

            var items = await query
                .OrderBy(s => s.ShiftDate)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            var importLookup = await GetImportedEmployeeLookupAsync(items.Select(item => item.EmployeeId));
            return items.Select(item => MapShift(item, importLookup)).ToList();
        }

        public async Task<IEnumerable<ShiftDto>> GetMyShiftsAsync(DateTime? from, DateTime? to)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
            {
                return Array.Empty<ShiftDto>();
            }

            var query = _context.Shift
                .AsNoTracking()
                .Include(s => s.Store)
                .Where(s => !s.IsDeleted && s.EmployeeId == currentUser.KorisnikId);

            if (from.HasValue)
            {
                query = query.Where(s => s.ShiftDate >= from.Value.Date);
            }

            if (to.HasValue)
            {
                query = query.Where(s => s.ShiftDate <= to.Value.Date);
            }

            var items = await query
                .OrderBy(s => s.ShiftDate)
                .ThenBy(s => s.StartTime)
                .ToListAsync();

            var importLookup = await GetImportedEmployeeLookupAsync(items.Select(item => item.EmployeeId));
            return items.Select(item => MapShift(item, importLookup)).ToList();
        }

        public async Task<IEnumerable<ShiftEmployeeDto>> GetEmployeesAsync(int? storeId)
        {
            await ResolveStoreIdAsync(storeId);

            var storeCode = await ResolveStoreCodeAsync(storeId);
            var query = _context.ParcijalnaInventuraImportZaposlenika
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(storeCode))
            {
                query = query.Where(e => e.OznakaOJ != null && e.OznakaOJ.EndsWith(storeCode));
            }

            var employees = await query
                .OrderBy(e => e.Prezime)
                .ThenBy(e => e.Ime)
                .ToListAsync();

            return employees.Select(e => new ShiftEmployeeDto
            {
                EmployeeId = e.BrojIzMaticneKnjige,
                EmployeeName = $"{e.Ime} {e.Prezime}".Trim(),
                Role = e.RadnoMjesto
            }).ToList();
        }

        public async Task<ShiftOperationResult> CreateShiftAsync(ShiftCreateRequest request)
        {
            if (IsReadOnlyRole())
            {
                return ShiftOperationResult.Failed("Rola uprava može samo pregledati smjene.");
            }

            int? storeId;
            try
            {
                storeId = await ResolveStoreIdAsync(request.StoreId);
            }
            catch (InvalidOperationException ex)
            {
                return ShiftOperationResult.Failed(ex.Message);
            }

            if (!storeId.HasValue)
            {
                return ShiftOperationResult.Failed("Prodavnica nije odabrana.");
            }

            var storeExists = await _context.Prodavnica.AnyAsync(p => p.KorisnikId == storeId.Value);
            if (!storeExists)
            {
                return ShiftOperationResult.Failed("Prodavnica nije pronađena.");
            }

            var resolvedEmployeeId = await ResolveEmployeeIdAsync(request.EmployeeName, request.EmployeeHrId ?? request.EmployeeId, storeId);
            if (!resolvedEmployeeId.HasValue)
            {
                return ShiftOperationResult.Failed("Zaposlenik nije pronađen.");
            }

            var warning = string.Empty;

            var shift = new Shift
            {
                StoreId = storeId.Value,
                EmployeeId = resolvedEmployeeId.Value,
                ShiftDate = request.ShiftDate.Date,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                BreakMinutes = request.BreakMinutes,
                ShiftType = request.ShiftType,
                DepartmentId = request.DepartmentId,
                Status = string.IsNullOrWhiteSpace(request.Status) ? StatusDraft : request.Status,
                Note = request.Note,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = (await GetCurrentUserAsync())?.KorisnikId,
                IsDeleted = false
            };

            _context.Shift.Add(shift);
            await _context.SaveChangesAsync();

            await _context.Entry(shift).Reference(s => s.Store).LoadAsync();

            await AddShiftAuditAsync(shift, "CREATE", null);
            await _context.SaveChangesAsync();

            var importLookup = await GetImportedEmployeeLookupAsync(new[] { shift.EmployeeId });
            return ShiftOperationResult.Ok(MapShift(shift, importLookup), warning);
        }

        public async Task<ShiftOperationResult> UpdateShiftAsync(int shiftId, ShiftUpdateRequest request)
        {
            if (IsReadOnlyRole())
            {
                return ShiftOperationResult.Failed("Rola uprava može samo pregledati smjene.");
            }

            var storeId = await ResolveStoreIdAsync(request.StoreId);
            var shift = await _context.Shift
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.ShiftId == shiftId && !s.IsDeleted);

            if (shift == null)
            {
                return ShiftOperationResult.Failed("Smjena nije pronađena.");
            }

            if (shift.Status == StatusCompleted)
            {
                return ShiftOperationResult.Failed("Smjena je završena i ne može se mijenjati.");
            }

            if (shift.Status == StatusPublished && !CanManagePublished())
            {
                return ShiftOperationResult.Failed("Nemate dozvolu za izmjenu objavljene smjene.");
            }

            if (shift.StoreId != storeId)
            {
                return ShiftOperationResult.Failed("Smjena ne pripada odabranoj prodavnici.");
            }

            var resolvedEmployeeId = await ResolveEmployeeIdAsync(request.EmployeeName, request.EmployeeHrId ?? request.EmployeeId, storeId);
            if (!resolvedEmployeeId.HasValue)
            {
                return ShiftOperationResult.Failed("Zaposlenik nije pronađen.");
            }

            var warning = string.Empty;

            var before = CloneShift(shift);

            shift.EmployeeId = resolvedEmployeeId.Value;
            shift.ShiftDate = request.ShiftDate.Date;
            shift.StartTime = request.StartTime;
            shift.EndTime = request.EndTime;
            shift.BreakMinutes = request.BreakMinutes;
            shift.ShiftType = request.ShiftType;
            shift.DepartmentId = request.DepartmentId;
            shift.Status = string.IsNullOrWhiteSpace(request.Status) ? shift.Status : request.Status;
            shift.Note = request.Note;
            shift.UpdatedAt = DateTime.UtcNow;
            shift.UpdatedBy = (await GetCurrentUserAsync())?.KorisnikId;

            await _context.SaveChangesAsync();

            await _context.Entry(shift).Reference(s => s.Store).LoadAsync();

            await AddShiftAuditAsync(shift, "UPDATE", before);
            await _context.SaveChangesAsync();

            var importLookup = await GetImportedEmployeeLookupAsync(new[] { shift.EmployeeId });
            return ShiftOperationResult.Ok(MapShift(shift, importLookup), warning);
        }

        public async Task<ShiftOperationResult> DeleteShiftAsync(int shiftId)
        {
            if (IsReadOnlyRole())
            {
                return ShiftOperationResult.Failed("Rola uprava može samo pregledati smjene.");
            }

            var shift = await _context.Shift
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.ShiftId == shiftId && !s.IsDeleted);

            if (shift == null)
            {
                return ShiftOperationResult.Failed("Smjena nije pronađena.");
            }

            if (shift.Status == StatusCompleted)
            {
                return ShiftOperationResult.Failed("Smjena je završena i ne može se obrisati.");
            }

            if (shift.Status == StatusPublished && !CanManagePublished())
            {
                return ShiftOperationResult.Failed("Nemate dozvolu za brisanje objavljene smjene.");
            }

            await ResolveStoreIdAsync(shift.StoreId);

            var before = CloneShift(shift);

            shift.IsDeleted = true;
            shift.Status = StatusCancelled;
            shift.UpdatedAt = DateTime.UtcNow;
            shift.UpdatedBy = (await GetCurrentUserAsync())?.KorisnikId;

            await _context.SaveChangesAsync();

            await AddShiftAuditAsync(shift, "DELETE", before);
            await _context.SaveChangesAsync();

            return ShiftOperationResult.Ok(MapShift(shift));
        }

        public async Task<ShiftOperationResult> CopyWeekAsync(ShiftCopyWeekRequest request)
        {
            if (IsReadOnlyRole())
            {
                return ShiftOperationResult.Failed("Rola uprava može samo pregledati smjene.");
            }

            var storeId = await ResolveStoreIdAsync(request.StoreId);
            var sourceStart = request.SourceWeekStart.Date;
            var targetStart = request.TargetWeekStart.Date;
            var sourceEnd = sourceStart.AddDays(6);
            var targetEnd = targetStart.AddDays(6);

            if (sourceStart == targetStart)
            {
                return ShiftOperationResult.Failed("Izvorna i ciljna sedmica su iste.");
            }

            var sourceShifts = await _context.Shift
                .Where(s => !s.IsDeleted && s.StoreId == storeId && s.ShiftDate >= sourceStart && s.ShiftDate <= sourceEnd)
                .ToListAsync();

            if (request.Overwrite)
            {
                var targetShifts = await _context.Shift
                    .Where(s => !s.IsDeleted && s.StoreId == storeId && s.ShiftDate >= targetStart && s.ShiftDate <= targetEnd)
                    .ToListAsync();

                foreach (var shift in targetShifts)
                {
                    var before = CloneShift(shift);
                    shift.IsDeleted = true;
                    shift.Status = StatusCancelled;
                    shift.UpdatedAt = DateTime.UtcNow;
                    shift.UpdatedBy = (await GetCurrentUserAsync())?.KorisnikId;
                    await AddShiftAuditAsync(shift, "DELETE", before);
                }
            }

            var offset = (targetStart - sourceStart).Days;
            var now = DateTime.UtcNow;
            var currentUserId = (await GetCurrentUserAsync())?.KorisnikId;
            var newShifts = new List<Shift>();

            foreach (var shift in sourceShifts)
            {
                var copied = new Shift
                {
                    StoreId = shift.StoreId,
                    EmployeeId = shift.EmployeeId,
                    ShiftDate = shift.ShiftDate.AddDays(offset),
                    StartTime = shift.StartTime,
                    EndTime = shift.EndTime,
                    BreakMinutes = shift.BreakMinutes,
                    ShiftType = shift.ShiftType,
                    DepartmentId = shift.DepartmentId,
                    Status = StatusDraft,
                    Note = shift.Note,
                    CreatedAt = now,
                    CreatedBy = currentUserId,
                    IsDeleted = false
                };
                newShifts.Add(copied);
            }

            if (newShifts.Any())
            {
                await _context.Shift.AddRangeAsync(newShifts);
            }

            await _context.SaveChangesAsync();

            foreach (var shift in newShifts)
            {
                await AddShiftAuditAsync(shift, "COPY", null);
            }

            await _context.SaveChangesAsync();

            return ShiftOperationResult.Ok(new ShiftDto { StoreId = storeId ?? 0 });
        }

        public async Task<ShiftOperationResult> PublishAsync(ShiftPublishRequest request)
        {
            if (IsReadOnlyRole())
            {
                return ShiftOperationResult.Failed("Rola uprava može samo pregledati smjene.");
            }

            var storeId = await ResolveStoreIdAsync(request.StoreId);
            var fromDate = request.From.Date;
            var toDate = request.To.Date;

            if (toDate < fromDate)
            {
                return ShiftOperationResult.Failed("Datum od ne može biti veći od datuma do.");
            }

            var shifts = await _context.Shift
                .Where(s => !s.IsDeleted && s.StoreId == storeId && s.ShiftDate >= fromDate && s.ShiftDate <= toDate)
                .ToListAsync();

            if (!shifts.Any())
            {
                return ShiftOperationResult.Failed("Nema smjena za objavu u odabranom periodu.");
            }

            foreach (var shift in shifts)
            {
                if (shift.Status == StatusDraft)
                {
                    var before = CloneShift(shift);
                    shift.Status = StatusPublished;
                    shift.UpdatedAt = DateTime.UtcNow;
                    shift.UpdatedBy = (await GetCurrentUserAsync())?.KorisnikId;
                    await AddShiftAuditAsync(shift, "PUBLISH", before);
                }
            }

            await _context.SaveChangesAsync();

            return ShiftOperationResult.Ok(new ShiftDto { StoreId = storeId ?? 0 });
        }

        public async Task<ShiftRequestDto?> CreateShiftRequestAsync(ShiftRequestCreateRequest request)
        {
            var storeId = await ResolveStoreIdAsync(request.StoreId);
            var employeeExists = await _context.Korisnik.AnyAsync(k => k.KorisnikId == request.EmployeeId);
            if (!employeeExists)
            {
                throw new InvalidOperationException("Zaposlenik nije pronađen.");
            }

            if (string.Equals(request.Type, "Swap", StringComparison.OrdinalIgnoreCase) && !request.RelatedShiftId.HasValue)
            {
                throw new InvalidOperationException("Za zamjenu je potrebno odabrati smjenu.");
            }

            if (string.Equals(request.Type, "DayOff", StringComparison.OrdinalIgnoreCase) && !request.RequestedDate.HasValue)
            {
                throw new InvalidOperationException("Za slobodan dan potrebno je odabrati datum.");
            }

            var shiftRequest = new ShiftRequest
            {
                StoreId = storeId.Value,
                EmployeeId = request.EmployeeId,
                Type = request.Type,
                RelatedShiftId = request.RelatedShiftId,
                RequestedDate = request.RequestedDate?.Date,
                Message = request.Message,
                Status = RequestStatusPending,
                CreatedAt = DateTime.UtcNow
            };

            _context.ShiftRequest.Add(shiftRequest);
            await _context.SaveChangesAsync();

            await _context.Entry(shiftRequest).Reference(s => s.Employee).LoadAsync();
            await _context.Entry(shiftRequest).Reference(s => s.Store).LoadAsync();

            return MapShiftRequest(shiftRequest);
        }

        public async Task<IEnumerable<ShiftRequestDto>> GetShiftRequestsAsync(int? storeId, string? status)
        {
            var resolvedStoreId = await ResolveStoreIdAsync(storeId);

            var query = _context.ShiftRequest
                .AsNoTracking()
                .Include(r => r.Employee)
                .Include(r => r.Store)
                .Where(r => r.StoreId == resolvedStoreId);

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(r => r.Status == status);
            }

            var requests = await query
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return requests.Select(MapShiftRequest).ToList();
        }

        public async Task<ShiftRequestDto?> ApproveShiftRequestAsync(int requestId, string? managerNote)
        {
            if (!CanManageRequests())
            {
                throw new InvalidOperationException("Nemate dozvolu za odobravanje zahtjeva.");
            }

            var request = await _context.ShiftRequest
                .Include(r => r.Employee)
                .Include(r => r.Store)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null)
            {
                return null;
            }

            await ResolveStoreIdAsync(request.StoreId);

            request.Status = RequestStatusApproved;
            request.ManagerNote = managerNote;
            request.ApprovedBy = (await GetCurrentUserAsync())?.KorisnikId;
            request.ApprovedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapShiftRequest(request);
        }

        public async Task<ShiftRequestDto?> RejectShiftRequestAsync(int requestId, string? managerNote)
        {
            if (!CanManageRequests())
            {
                throw new InvalidOperationException("Nemate dozvolu za odbijanje zahtjeva.");
            }

            var request = await _context.ShiftRequest
                .Include(r => r.Employee)
                .Include(r => r.Store)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null)
            {
                return null;
            }

            await ResolveStoreIdAsync(request.StoreId);

            request.Status = RequestStatusRejected;
            request.ManagerNote = managerNote;
            request.ApprovedBy = (await GetCurrentUserAsync())?.KorisnikId;
            request.ApprovedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapShiftRequest(request);
        }

        private async Task<Korisnik?> GetCurrentUserAsync()
        {
            if (_currentUser != null)
            {
                return _currentUser;
            }

            var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            _currentUser = await _context.Korisnik
                .Include(k => k.Prodavnica)
                .FirstOrDefaultAsync(k => k.KorisnickoIme == username);
            return _currentUser;
        }

        private bool IsAdmin()
        {
            return string.Equals(GetCurrentRole(), RoleAdmin, StringComparison.OrdinalIgnoreCase);
        }

        private bool CanManagePublished()
        {
            var role = GetCurrentRole();
            return string.Equals(role, RolePodrucni, StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, RoleRegional, StringComparison.OrdinalIgnoreCase);
        }

        private bool CanManageRequests()
        {
            var role = GetCurrentRole();
            return !string.Equals(role, RoleStore, StringComparison.OrdinalIgnoreCase)
                && !string.Equals(role, RoleAdmin, StringComparison.OrdinalIgnoreCase);
        }

        private string? GetCurrentRole()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
        }

        private bool IsReadOnlyRole()
        {
            return string.Equals(GetCurrentRole(), RoleAdmin, StringComparison.OrdinalIgnoreCase);
        }

        private bool IsStoreRole()
        {
            return string.Equals(GetCurrentRole(), RoleStore, StringComparison.OrdinalIgnoreCase);
        }

        private async Task<int?> ResolveStoreIdAsync(int? storeId)
        {
            var role = GetCurrentRole();
            if (string.Equals(role, RoleStore, StringComparison.OrdinalIgnoreCase))
            {
                var currentUser = await GetCurrentUserAsync();
                var currentStoreId = currentUser?.Prodavnica?.KorisnikId;
                if (!currentStoreId.HasValue)
                {
                    throw new InvalidOperationException("Korisnik nema dodijeljenu prodavnicu.");
                }

                if (storeId.HasValue && storeId.Value > 0 && storeId.Value != currentStoreId.Value)
                {
                    throw new InvalidOperationException("Nemate pristup odabranoj prodavnici.");
                }

                return currentStoreId.Value;
            }

            if (!storeId.HasValue)
            {
                return null;
            }

            return storeId.Value;
        }

        private async Task<string?> ValidateShiftAsync(int? shiftId, int employeeId, DateTime shiftDate, TimeSpan start, TimeSpan end, int breakMinutes)
        {
            if (end <= start)
            {
                return "Vrijeme završetka mora biti nakon vremena početka.";
            }

            if (breakMinutes < 0)
            {
                return "Pauza ne može biti negativna.";
            }

            var durationMinutes = (end - start).TotalMinutes;
            if (breakMinutes > durationMinutes)
            {
                return "Pauza ne može biti duža od trajanja smjene.";
            }

            var query = _context.Shift
                .AsNoTracking()
                .Where(s => !s.IsDeleted && s.EmployeeId == employeeId && s.ShiftDate == shiftDate.Date);

            if (shiftId.HasValue)
            {
                query = query.Where(s => s.ShiftId != shiftId.Value);
            }

            var overlaps = await query.AnyAsync(s => start < s.EndTime && end > s.StartTime);
            if (overlaps)
            {
                return "Smjene se preklapaju za odabranog zaposlenika.";
            }

            var minRest = TimeSpan.FromHours(_options.MinimumRestHours);
            var targetStart = shiftDate.Date.Add(start);
            var targetEnd = shiftDate.Date.Add(end);
            var restQuery = _context.Shift
                .AsNoTracking()
                .Where(s => !s.IsDeleted && s.EmployeeId == employeeId && s.ShiftDate >= shiftDate.Date.AddDays(-1) && s.ShiftDate <= shiftDate.Date.AddDays(1));

            if (shiftId.HasValue)
            {
                restQuery = restQuery.Where(s => s.ShiftId != shiftId.Value);
            }

            var restShifts = await restQuery.ToListAsync();
            foreach (var shift in restShifts)
            {
                var existingStart = shift.ShiftDate.Date.Add(shift.StartTime);
                var existingEnd = shift.ShiftDate.Date.Add(shift.EndTime);

                if (existingEnd <= targetStart)
                {
                    if (targetStart - existingEnd < minRest)
                    {
                        return $"Minimalni odmor između smjena je {_options.MinimumRestHours} sati.";
                    }
                }
                else if (existingStart >= targetEnd)
                {
                    if (existingStart - targetEnd < minRest)
                    {
                        return $"Minimalni odmor između smjena je {_options.MinimumRestHours} sati.";
                    }
                }
            }

            return null;
        }

        private async Task<string?> ValidateWeeklyHoursAsync(int? shiftId, int employeeId, DateTime shiftDate, TimeSpan start, TimeSpan end, int breakMinutes)
        {
            var weekStart = GetWeekStart(shiftDate);
            var weekEnd = weekStart.AddDays(6);

            var weekShiftsQuery = _context.Shift
                .AsNoTracking()
                .Where(s => !s.IsDeleted && s.EmployeeId == employeeId && s.ShiftDate >= weekStart && s.ShiftDate <= weekEnd);

            if (shiftId.HasValue)
            {
                weekShiftsQuery = weekShiftsQuery.Where(s => s.ShiftId != shiftId.Value);
            }

            var weekShifts = await weekShiftsQuery.ToListAsync();
            var totalHours = weekShifts.Sum(GetShiftHours);
            totalHours += GetShiftHours(start, end, breakMinutes);

            if (totalHours > _options.MaxWeeklyHours)
            {
                return $"Prekoračen je maksimalni sedmični broj sati ({_options.MaxWeeklyHours}).";
            }

            return null;
        }

        private static DateTime GetWeekStart(DateTime date)
        {
            var diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.Date.AddDays(-1 * diff);
        }

        private static double GetShiftHours(Shift shift)
        {
            return GetShiftHours(shift.StartTime, shift.EndTime, shift.BreakMinutes);
        }

        private static double GetShiftHours(TimeSpan start, TimeSpan end, int breakMinutes)
        {
            return Math.Max(0, (end - start).TotalHours - (breakMinutes / 60.0));
        }

        private ShiftDto MapShift(Shift shift, IReadOnlyDictionary<int, string>? importLookup = null)
        {
            var employeeName = importLookup != null && importLookup.TryGetValue(shift.EmployeeId, out var importedName)
                ? importedName
                : null;

            return new ShiftDto
            {
                ShiftId = shift.ShiftId,
                StoreId = shift.StoreId,
                StoreLabel = shift.Store != null ? $"{shift.Store.BrojProdavnice} - {shift.Store.Mjesto}" : null,
                EmployeeId = shift.EmployeeId,
                EmployeeName = employeeName,
                ShiftDate = shift.ShiftDate,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                BreakMinutes = shift.BreakMinutes,
                ShiftType = shift.ShiftType,
                DepartmentId = shift.DepartmentId,
                Status = shift.Status,
                Note = shift.Note,
                CreatedAt = shift.CreatedAt,
                CreatedBy = shift.CreatedBy,
                UpdatedAt = shift.UpdatedAt,
                UpdatedBy = shift.UpdatedBy
            };
        }

        private ShiftRequestDto MapShiftRequest(ShiftRequest request)
        {
            return new ShiftRequestDto
            {
                RequestId = request.RequestId,
                StoreId = request.StoreId,
                StoreLabel = request.Store != null ? $"{request.Store.BrojProdavnice} - {request.Store.Mjesto}" : null,
                EmployeeId = request.EmployeeId,
                EmployeeName = request.Employee?.KorisnickoIme,
                Type = request.Type,
                RelatedShiftId = request.RelatedShiftId,
                RequestedDate = request.RequestedDate,
                Message = request.Message,
                Status = request.Status,
                ManagerNote = request.ManagerNote,
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt,
                ApprovedBy = request.ApprovedBy,
                ApprovedAt = request.ApprovedAt
            };
        }

        private static Shift CloneShift(Shift shift)
        {
            return new Shift
            {
                ShiftId = shift.ShiftId,
                StoreId = shift.StoreId,
                EmployeeId = shift.EmployeeId,
                ShiftDate = shift.ShiftDate,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                BreakMinutes = shift.BreakMinutes,
                ShiftType = shift.ShiftType,
                DepartmentId = shift.DepartmentId,
                Status = shift.Status,
                Note = shift.Note,
                CreatedAt = shift.CreatedAt,
                CreatedBy = shift.CreatedBy,
                UpdatedAt = shift.UpdatedAt,
                UpdatedBy = shift.UpdatedBy,
                IsDeleted = shift.IsDeleted
            };
        }

        private async Task AddShiftAuditAsync(Shift shift, string action, Shift? before)
        {
            var audit = new ShiftAudit
            {
                EntityName = nameof(Shift),
                EntityId = shift.ShiftId.ToString(),
                Action = action,
                BeforeJson = before == null ? null : JsonSerializer.Serialize(MapShift(before)),
                AfterJson = JsonSerializer.Serialize(MapShift(shift)),
                ActorUserId = (await GetCurrentUserAsync())?.KorisnikId,
                Timestamp = DateTime.UtcNow
            };

            _context.ShiftAudit.Add(audit);
        }

        private async Task<Dictionary<int, string>> GetImportedEmployeeLookupAsync(IEnumerable<int> employeeIds)
        {
            var idList = employeeIds.Distinct().ToList();
            if (!idList.Any())
            {
                return new Dictionary<int, string>();
            }

            var employees = await _context.ParcijalnaInventuraImportZaposlenika
                .AsNoTracking()
                .Where(e => idList.Contains(e.BrojIzMaticneKnjige))
                .OrderByDescending(e => e.DatumUcitavanja)
                .Select(e => new
                {
                    e.BrojIzMaticneKnjige,
                    e.Ime,
                    e.Prezime,
                    e.DatumUcitavanja
                })
                .ToListAsync();

            return employees
                .GroupBy(e => e.BrojIzMaticneKnjige)
                .ToDictionary(
                    group => group.Key,
                    group => $"{group.First().Ime} {group.First().Prezime}".Trim());
        }

        private async Task<int?> ResolveEmployeeIdAsync(string? employeeName, int? employeeHrId, int? storeId)
        {
            var storeCode = await ResolveStoreCodeAsync(storeId);
            if (employeeHrId.HasValue)
            {
                var query = _context.ParcijalnaInventuraImportZaposlenika.AsNoTracking();
                if (!string.IsNullOrWhiteSpace(storeCode))
                {
                    query = query.Where(e => e.OznakaOJ != null && e.OznakaOJ.EndsWith(storeCode));
                }

                var employeeById = await query
                    .OrderByDescending(e => e.DatumUcitavanja)
                    .FirstOrDefaultAsync(e => e.BrojIzMaticneKnjige == employeeHrId.Value);
                if (employeeById != null)
                {
                    return employeeById.BrojIzMaticneKnjige;
                }
            }

            if (string.IsNullOrWhiteSpace(employeeName))
            {
                return null;
            }

            var trimmed = employeeName.Trim();
            if (string.IsNullOrWhiteSpace(trimmed))
            {
                return null;
            }

            var parts = trimmed.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var firstName = parts.FirstOrDefault() ?? trimmed;
            var lastName = parts.Length > 1 ? string.Join(' ', parts.Skip(1)) : string.Empty;
            var firstLower = firstName.ToLowerInvariant();
            var lastLower = lastName.ToLowerInvariant();

            var nameQuery = _context.ParcijalnaInventuraImportZaposlenika.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(storeCode))
            {
                nameQuery = nameQuery.Where(e => e.OznakaOJ != null && e.OznakaOJ.EndsWith(storeCode));
            }

            if (!string.IsNullOrWhiteSpace(lastName))
            {
                nameQuery = nameQuery.Where(e => e.Ime.ToLower() == firstLower && e.Prezime.ToLower() == lastLower);
            }
            else
            {
                nameQuery = nameQuery.Where(e => e.Ime.ToLower() == firstLower || e.Prezime.ToLower() == firstLower);
            }

            var employeeByName = await nameQuery
                .OrderByDescending(e => e.DatumUcitavanja)
                .FirstOrDefaultAsync();

            return employeeByName?.BrojIzMaticneKnjige;
        }

        private async Task<string?> ResolveStoreCodeAsync(int? storeId)
        {
            if (IsStoreRole())
            {
                var currentUser = await GetCurrentUserAsync();
                return ExtractStoreCode(currentUser?.KorisnickoIme);
            }

            if (storeId.HasValue)
            {
                var store = await _context.Prodavnica
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.KorisnikId == storeId.Value);
                return ExtractStoreCode(store?.BrojProdavnice);
            }

            return null;
        }

        private static string? ExtractStoreCode(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var trimmed = value.Trim();
            if (trimmed.Length <= 4)
            {
                return trimmed;
            }

            return trimmed.Substring(trimmed.Length - 4);
        }
    }
}
