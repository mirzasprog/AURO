using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Data
{
    public class DailyTaskRepository : IDailyTaskRepository
    {
        private const string StatusOpen = "OPEN";
        private const string StatusInProgress = "IN_PROGRESS";
        private const string StatusDone = "DONE";
        private const string TypeRepetitive = "REPETITIVE";
        private const string TypeCustom = "CUSTOM";

        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? _korisnickoIme;
        private Korisnik? _currentUser;

        public DailyTaskRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        private async Task<Korisnik?> GetCurrentUserAsync()
        {
            if (_currentUser != null)
            {
                return _currentUser;
            }

            if (string.IsNullOrWhiteSpace(_korisnickoIme))
            {
                return null;
            }

            _currentUser = await _context.Korisnik
                .Include(k => k.Prodavnica)
                .AsNoTracking()
                .FirstOrDefaultAsync(k => k.KorisnickoIme == _korisnickoIme);
            return _currentUser;
        }

        public async Task EnsureDailyTasksGeneratedAsync(int prodavnicaId, DateTime date)
        {
            var activeTemplates = await _context.DailyTaskTemplate
                .Where(t => t.IsActive)
                .OrderBy(t => t.Id)
                .ToListAsync();

            if (!activeTemplates.Any())
            {
                return;
            }

            var existingTemplateIds = await _context.DailyTask
                .Where(t => t.ProdavnicaId == prodavnicaId
                    && t.Date == date.Date
                    && t.Type == TypeRepetitive
                    && t.TemplateId != null)
                .Select(t => t.TemplateId!.Value)
                .ToListAsync();

            var newTasks = new List<DailyTask>();
            foreach (var template in activeTemplates)
            {
                if (existingTemplateIds.Contains(template.Id))
                {
                    continue;
                }

                var task = new DailyTask
                {
                    Title = template.Title,
                    Description = template.Description,
                    Type = TypeRepetitive,
                    ProdavnicaId = prodavnicaId,
                    Date = date.Date,
                    Status = template.DefaultStatus ?? StatusOpen,
                    ImageAllowed = template.ImageAllowed,
                    TemplateId = template.Id
                };
                newTasks.Add(task);
            }

            if (newTasks.Any())
            {
                await _context.DailyTask.AddRangeAsync(newTasks);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<DailyTaskDto>> GetTasksForStoreAsync(int prodavnicaId, DateTime date, string? typeFilter = null)
        {
            var query = _context.DailyTask
                .AsNoTracking()
                .Include(t => t.CreatedBy)
                .Include(t => t.CompletedBy)
                .Include(t => t.Prodavnica)
                .Where(t => t.ProdavnicaId == prodavnicaId && t.Date == date.Date);

            if (!string.IsNullOrWhiteSpace(typeFilter))
            {
                query = query.Where(t => t.Type == typeFilter);
            }

            var tasks = await query
                .OrderBy(t => t.Type)
                .ThenBy(t => t.Title)
                .ToListAsync();

            return tasks.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<DailyTaskDto>> GetTasksForCurrentStoreAsync(DateTime date, string? typeFilter = null)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser?.Prodavnica == null)
            {
                return Enumerable.Empty<DailyTaskDto>();
            }

            await EnsureDailyTasksGeneratedAsync(currentUser.Prodavnica.KorisnikId, date);
            return await GetTasksForStoreAsync(currentUser.Prodavnica.KorisnikId, date, typeFilter);
        }

        public async Task<IEnumerable<DailyTaskDto>> GetTaskHistoryAsync(DateTime from, DateTime to, int? storeId, string? statusFilter = null, string? typeFilter = null)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
            {
                return Enumerable.Empty<DailyTaskDto>();
            }

            var isStoreUser = string.Equals(currentUser.Uloga, "prodavnica", StringComparison.OrdinalIgnoreCase);
            int? resolvedStoreId = storeId;

            if (isStoreUser)
            {
                resolvedStoreId = currentUser.Prodavnica?.KorisnikId;
            }

            var normalizedStatus = string.IsNullOrWhiteSpace(statusFilter) || string.Equals(statusFilter, "ALL", StringComparison.OrdinalIgnoreCase)
                ? null
                : NormalizeStatus(statusFilter);

            var query = _context.DailyTask
                .AsNoTracking()
                .Include(t => t.CreatedBy)
                .Include(t => t.CompletedBy)
                .Include(t => t.Prodavnica)
                .Where(t => t.Date >= from.Date && t.Date <= to.Date);

            if (resolvedStoreId.HasValue)
            {
                query = query.Where(t => t.ProdavnicaId == resolvedStoreId.Value);
            }

            if (!string.IsNullOrWhiteSpace(normalizedStatus))
            {
                query = query.Where(t => t.Status == normalizedStatus);
            }

            if (!string.IsNullOrWhiteSpace(typeFilter) && !string.Equals(typeFilter, "ALL", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(t => t.Type == typeFilter);
            }

            var tasks = await query
                .OrderByDescending(t => t.Date)
                .ThenBy(t => t.ProdavnicaId)
                .ThenBy(t => t.Title)
                .ToListAsync();

            return tasks.Select(MapToDto).ToList();
        }

        public async Task<DailyTaskOperationResult> UpdateTaskStatusAsync(int taskId, DailyTaskStatusUpdateRequest request)
        {
            var task = await _context.DailyTask
                .Include(t => t.Prodavnica)
                .Include(t => t.CreatedBy)
                .Include(t => t.CompletedBy)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null)
            {
                return DailyTaskOperationResult.Failed("Zadatak nije pronađen.");
            }

            if (string.Equals(request.Status, StatusDone, StringComparison.OrdinalIgnoreCase) && string.IsNullOrWhiteSpace(request.CompletionNote))
            {
                return DailyTaskOperationResult.Failed("Potrebno je unijeti napomenu za završeni zadatak.");
            }

            var normalizedStatus = NormalizeStatus(request.Status);
            task.Status = normalizedStatus;

            if (string.Equals(normalizedStatus, StatusDone, StringComparison.OrdinalIgnoreCase))
            {
                task.CompletedAt = DateTime.Now;
                var currentUser = await GetCurrentUserAsync();
                task.CompletedById = currentUser?.KorisnikId;
                task.CompletionNote = request.CompletionNote;
            }
            else
            {
                if (request.RemoveImage)
                {
                    RemoveExistingImage(task);
                }

                task.CompletedAt = null;
                task.CompletedById = null;
                task.CompletionNote = request.CompletionNote;
                if (!string.Equals(normalizedStatus, StatusInProgress, StringComparison.OrdinalIgnoreCase))
                {
                    task.CompletionNote = request.CompletionNote;
                }
            }

            if (request.Image != null && task.ImageAllowed)
            {
                var imagePath = await SaveTaskImageAsync(task, request.Image);
                task.ImageAttachment = imagePath;
            }
            else if (request.RemoveImage)
            {
                RemoveExistingImage(task);
                task.ImageAttachment = null;
            }

            await _context.SaveChangesAsync();
            await _context.Entry(task).Reference(t => t.CreatedBy).LoadAsync();
            await _context.Entry(task).Reference(t => t.CompletedBy).LoadAsync();
            await _context.Entry(task).Reference(t => t.Prodavnica).LoadAsync();

            return DailyTaskOperationResult.Ok(MapToDto(task));
        }

        public async Task<DailyTaskOperationResult> CreateCustomTaskAsync(DailyTaskCreateRequest request)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
            {
                return DailyTaskOperationResult.Failed("Korisnik nije pronađen.");
            }

            if (string.Equals(currentUser.Uloga, "prodavnica", StringComparison.OrdinalIgnoreCase)
                && currentUser.Prodavnica != null
                && currentUser.Prodavnica.KorisnikId != request.ProdavnicaId)
            {
                return DailyTaskOperationResult.Failed("Nemate dozvolu za kreiranje zadatka za odabranu prodavnicu.");
            }

            var prodavnicaExists = await _context.Prodavnica.AnyAsync(p => p.KorisnikId == request.ProdavnicaId);
            if (!prodavnicaExists)
            {
                return DailyTaskOperationResult.Failed("Prodavnica nije pronađena.");
            }

            var task = new DailyTask
            {
                Title = request.Title,
                Description = request.Description,
                Date = request.Date.Date,
                ProdavnicaId = request.ProdavnicaId,
                Type = request.IsRecurring ? TypeRepetitive : TypeCustom,
                Status = StatusOpen,
                ImageAllowed = request.ImageAllowed,
                CreatedById = currentUser.KorisnikId,
                IsRecurring = request.IsRecurring
            };

            _context.DailyTask.Add(task);
            await _context.SaveChangesAsync();

            await _context.Entry(task).Reference(t => t.Prodavnica).LoadAsync();
            await _context.Entry(task).Reference(t => t.CreatedBy).LoadAsync();

            return DailyTaskOperationResult.Ok(MapToDto(task));
        }

        public async Task<DailyTaskBulkOperationResult> CreateBulkCustomTasksAsync(DailyTaskBulkCreateRequest request)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
            {
                return DailyTaskBulkOperationResult.Failed("Korisnik nije pronađen.");
            }

            if (!string.Equals(currentUser.Uloga, "uprava", StringComparison.OrdinalIgnoreCase))
            {
                return DailyTaskBulkOperationResult.Failed("Nemate dozvolu za masovno kreiranje zadataka.");
            }

            var targetType = request.TargetType?.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(targetType))
            {
                return DailyTaskBulkOperationResult.Failed("Odaberite način slanja zadataka.");
            }

            IQueryable<Prodavnica> storeQuery = _context.Prodavnica.AsNoTracking();
            switch (targetType)
            {
                case "stores":
                    if (request.StoreIds == null || !request.StoreIds.Any())
                    {
                        return DailyTaskBulkOperationResult.Failed("Odaberite barem jednu prodavnicu.");
                    }
                    storeQuery = storeQuery.Where(p => request.StoreIds.Contains(p.KorisnikId));
                    break;
                case "city":
                    if (string.IsNullOrWhiteSpace(request.City))
                    {
                        return DailyTaskBulkOperationResult.Failed("Odaberite grad.");
                    }
                    storeQuery = storeQuery.Where(p => p.Mjesto == request.City);
                    break;
                case "manager":
                    if (!request.ManagerId.HasValue)
                    {
                        return DailyTaskBulkOperationResult.Failed("Odaberite područnog voditelja.");
                    }
                    storeQuery = storeQuery.Where(p => p.MenadzerId == request.ManagerId);
                    break;
                case "format":
                    if (string.IsNullOrWhiteSpace(request.Format))
                    {
                        return DailyTaskBulkOperationResult.Failed("Odaberite format prodavnice.");
                    }
                    storeQuery = storeQuery.Where(p => p.NazivCjenika == request.Format);
                    break;
                default:
                    return DailyTaskBulkOperationResult.Failed("Nepodržan način slanja zadataka.");
            }

            var stores = await storeQuery.ToListAsync();
            if (!stores.Any())
            {
                return DailyTaskBulkOperationResult.Failed("Nije pronađena nijedna prodavnica za odabrani kriterij.");
            }

            var tasks = stores.Select(store => new DailyTask
            {
                Title = request.Title,
                Description = request.Description,
                Date = request.Date.Date,
                ProdavnicaId = store.KorisnikId,
                Type = request.IsRecurring ? TypeRepetitive : TypeCustom,
                Status = StatusOpen,
                ImageAllowed = request.ImageAllowed,
                CreatedById = currentUser.KorisnikId,
                IsRecurring = request.IsRecurring
            }).ToList();

            _context.DailyTask.AddRange(tasks);
            await _context.SaveChangesAsync();

            return DailyTaskBulkOperationResult.Ok(tasks.Count, stores.Count);
        }

        public async Task<DailyTaskOperationResult> UpdateCustomTaskAsync(int taskId, DailyTaskUpdateRequest request)
        {
            var currentUser = await GetCurrentUserAsync();
            if (currentUser == null)
            {
                return DailyTaskOperationResult.Failed("Korisnik nije pronađen.");
            }

            var task = await _context.DailyTask
                .Include(t => t.Prodavnica)
                .Include(t => t.CreatedBy)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            var isUserRepetitive = task != null
                && string.Equals(task.Type, TypeRepetitive, StringComparison.OrdinalIgnoreCase)
                && task.TemplateId == null
                && task.CreatedById.HasValue;

            if (task == null || (!string.Equals(task.Type, TypeCustom, StringComparison.OrdinalIgnoreCase) && !isUserRepetitive))
            {
                return DailyTaskOperationResult.Failed("Zadatak nije pronađen ili nije prilagođeni zadatak.");
            }

            if (string.Equals(currentUser.Uloga, "prodavnica", StringComparison.OrdinalIgnoreCase)
                && task.CreatedById != currentUser.KorisnikId)
            {
                return DailyTaskOperationResult.Failed("Nemate dozvolu za uređivanje ovog zadatka.");
            }

            task.Title = request.Title;
            task.Description = request.Description;
            task.Date = request.Date.Date;
            task.ImageAllowed = request.ImageAllowed;
            task.IsRecurring = request.IsRecurring;
            task.Type = request.IsRecurring ? TypeRepetitive : TypeCustom;

            await _context.SaveChangesAsync();

            return DailyTaskOperationResult.Ok(MapToDto(task));
        }

        public async Task<IEnumerable<DailyTaskStoreDto>> GetStoresAsync()
        {
            var stores = await (from prodavnica in _context.Prodavnica.AsNoTracking()
                                join menadzer in _context.Menadzer.AsNoTracking()
                                    on prodavnica.MenadzerId equals menadzer.KorisnikId into menadzeri
                                from menadzer in menadzeri.DefaultIfEmpty()
                                orderby prodavnica.BrojProdavnice
                                select new DailyTaskStoreDto
                                {
                                    Id = prodavnica.KorisnikId,
                                    Code = prodavnica.BrojProdavnice,
                                    Name = $"{prodavnica.BrojProdavnice} - {prodavnica.Mjesto}",
                                    City = prodavnica.Mjesto,
                                    Format = prodavnica.NazivCjenika,
                                    ManagerId = prodavnica.MenadzerId,
                                    ManagerName = menadzer != null ? $"{menadzer.Ime} {menadzer.Prezime}" : null
                                }).ToListAsync();

            return stores;
        }

        private string NormalizeStatus(string status)
        {
            return status?.ToUpperInvariant() switch
            {
                StatusInProgress => StatusInProgress,
                StatusDone => StatusDone,
                _ => StatusOpen
            };
        }

        private DailyTaskDto MapToDto(DailyTask task)
        {
            var storeName = task.Prodavnica != null ? $"{task.Prodavnica.BrojProdavnice} - {task.Prodavnica.Mjesto}" : null;
            return new DailyTaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Type = task.Type,
                Date = task.Date,
                Status = task.Status,
                ImageAllowed = task.ImageAllowed,
                ImageAttachment = task.ImageAttachment,
                CompletionNote = task.CompletionNote,
                CompletedAt = task.CompletedAt,
                CompletedBy = task.CompletedBy != null ? task.CompletedBy.KorisnickoIme : null,
                CreatedBy = task.CreatedBy != null ? task.CreatedBy.KorisnickoIme : null,
                ProdavnicaId = task.ProdavnicaId,
                ProdavnicaBroj = task.Prodavnica?.BrojProdavnice,
                ProdavnicaNaziv = storeName,
                IsEditable = string.Equals(task.Type, TypeCustom, StringComparison.OrdinalIgnoreCase)
                    || (string.Equals(task.Type, TypeRepetitive, StringComparison.OrdinalIgnoreCase)
                        && task.TemplateId == null
                        && task.CreatedById.HasValue),
                IsRecurring = task.IsRecurring
            };
        }

        private async Task<string> SaveTaskImageAsync(DailyTask task, IFormFile image)
        {
            var folder = Path.Combine("wwwroot", "daily-tasks", task.Date.ToString("yyyy"), task.Date.ToString("MM"), task.Date.ToString("dd"));
            var absolutePath = Path.Combine(Directory.GetCurrentDirectory(), folder);
            if (!Directory.Exists(absolutePath))
            {
                Directory.CreateDirectory(absolutePath);
            }

            var extension = Path.GetExtension(image.FileName);
            var fileName = $"task-{task.Id}-{DateTime.Now:HHmmssfff}{extension}";
            var fullPath = Path.Combine(absolutePath, fileName);

            RemoveExistingImage(task);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var relativePath = Path.Combine("daily-tasks", task.Date.ToString("yyyy"), task.Date.ToString("MM"), task.Date.ToString("dd"), fileName);
            return relativePath.Replace('\\', '/');
        }

        private void RemoveExistingImage(DailyTask task)
        {
            if (string.IsNullOrWhiteSpace(task.ImageAttachment))
            {
                return;
            }

            var sanitizedPath = task.ImageAttachment.Replace('/', Path.DirectorySeparatorChar);
            string existingPath;
            if (sanitizedPath.StartsWith("wwwroot" + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            {
                existingPath = Path.Combine(Directory.GetCurrentDirectory(), sanitizedPath);
            }
            else
            {
                existingPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", sanitizedPath.TrimStart(Path.DirectorySeparatorChar));
            }

            if (File.Exists(existingPath))
            {
                File.Delete(existingPath);
            }

            task.ImageAttachment = null;
        }
    }
}
