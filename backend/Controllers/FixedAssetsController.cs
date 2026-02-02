using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Entities;
using backend.Models.FixedAssets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize(Roles = "uprava,interna,podrucni,regionalni,logistika")]
    [Route("api/[controller]")]
    [ApiController]
    public class FixedAssetsController : ControllerBase
    {
        private readonly Auro2Context _context;

        public FixedAssetsController(Auro2Context context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<List<FixedAssetCategoryDto>>> GetCategories()
        {
            var categories = await _context.FixedAssetCategories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();

            var lookup = categories.ToDictionary(c => c.Id, MapCategory);
            foreach (var category in categories)
            {
                if (category.ParentCategoryId.HasValue && lookup.TryGetValue(category.ParentCategoryId.Value, out var parent))
                {
                    parent.Children.Add(lookup[category.Id]);
                }
            }

            var roots = categories
                .Where(c => !c.ParentCategoryId.HasValue)
                .Select(c => lookup[c.Id])
                .ToList();

            return Ok(roots);
        }

        [HttpPost("categories")]
        public async Task<ActionResult<FixedAssetCategoryDto>> CreateCategory([FromBody] FixedAssetCategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.ParentCategoryId.HasValue)
            {
                var parentExists = await _context.FixedAssetCategories.AnyAsync(c => c.Id == request.ParentCategoryId.Value);
                if (!parentExists)
                {
                    return NotFound(new { poruka = "Nije pronađena roditeljska kategorija." });
                }
            }

            var category = new FixedAssetCategory
            {
                Name = request.Name,
                Description = request.Description,
                ParentCategoryId = request.ParentCategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.FixedAssetCategories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(MapCategory(category));
        }

        [HttpGet]
        public async Task<ActionResult<List<FixedAssetListItem>>> GetAssets([FromQuery] int? categoryId, [FromQuery] string? status, [FromQuery] string? search)
        {
            var query = _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(a => a.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(a => a.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a => a.Name.Contains(search) || a.InventoryNumber.Contains(search) || a.SerialNumber.Contains(search));
            }

            var assets = await query
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new FixedAssetListItem
                {
                    Id = a.Id,
                    Name = a.Name,
                    InventoryNumber = a.InventoryNumber,
                    SerialNumber = a.SerialNumber,
                    CategoryName = a.Category.Name,
                    Status = a.Status,
                    Location = a.Location,
                    AssignedTo = a.AssignedTo,
                    PurchasePrice = a.PurchasePrice,
                    PurchaseDate = a.PurchaseDate,
                    AmortizationYears = a.AmortizationYears,
                    DepreciatedValue = CalculateDepreciatedValue(a.PurchasePrice, a.PurchaseDate, a.AmortizationYears)
                })
                .ToListAsync();

            return Ok(assets);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<FixedAssetDetailDto>> GetAsset(int id)
        {
            var asset = await _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Assignments)
                .Include(a => a.ServiceRecords)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (asset == null)
            {
                return NotFound();
            }

            return Ok(MapAssetDetail(asset));
        }

        [HttpPost]
        public async Task<ActionResult<FixedAssetDetailDto>> CreateAsset([FromBody] FixedAssetRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoryExists = await _context.FixedAssetCategories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return NotFound(new { poruka = "Kategorija nije pronađena." });
            }

            var duplicateInventory = await _context.FixedAssets.AnyAsync(a => a.InventoryNumber == request.InventoryNumber);
            if (duplicateInventory)
            {
                return Conflict(new { poruka = "Inventurni broj već postoji." });
            }

            var duplicateSerial = await _context.FixedAssets.AnyAsync(a => a.SerialNumber == request.SerialNumber);
            if (duplicateSerial)
            {
                return Conflict(new { poruka = "Serijski broj već postoji." });
            }

            var asset = new FixedAsset
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                InventoryNumber = request.InventoryNumber,
                SerialNumber = request.SerialNumber,
                PurchasePrice = request.PurchasePrice,
                Supplier = request.Supplier,
                PurchaseDate = request.PurchaseDate,
                WarrantyUntil = request.WarrantyUntil,
                AmortizationYears = request.AmortizationYears,
                Location = request.Location,
                Department = request.Department,
                Status = request.Status,
                AssignedTo = request.AssignedTo,
                Notes = request.Notes,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.FixedAssets.Add(asset);
            await _context.SaveChangesAsync();

            var created = await _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Assignments)
                .Include(a => a.ServiceRecords)
                .FirstAsync(a => a.Id == asset.Id);

            return Ok(MapAssetDetail(created));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<FixedAssetDetailDto>> UpdateAsset(int id, [FromBody] FixedAssetRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var asset = await _context.FixedAssets.FirstOrDefaultAsync(a => a.Id == id);
            if (asset == null)
            {
                return NotFound();
            }

            var duplicateInventory = await _context.FixedAssets
                .AnyAsync(a => a.InventoryNumber == request.InventoryNumber && a.Id != id);
            if (duplicateInventory)
            {
                return Conflict(new { poruka = "Inventurni broj već postoji." });
            }

            var duplicateSerial = await _context.FixedAssets
                .AnyAsync(a => a.SerialNumber == request.SerialNumber && a.Id != id);
            if (duplicateSerial)
            {
                return Conflict(new { poruka = "Serijski broj već postoji." });
            }

            asset.CategoryId = request.CategoryId;
            asset.Name = request.Name;
            asset.Description = request.Description;
            asset.InventoryNumber = request.InventoryNumber;
            asset.SerialNumber = request.SerialNumber;
            asset.PurchasePrice = request.PurchasePrice;
            asset.Supplier = request.Supplier;
            asset.PurchaseDate = request.PurchaseDate;
            asset.WarrantyUntil = request.WarrantyUntil;
            asset.AmortizationYears = request.AmortizationYears;
            asset.Location = request.Location;
            asset.Department = request.Department;
            asset.Status = request.Status;
            asset.AssignedTo = request.AssignedTo;
            asset.Notes = request.Notes;
            asset.IsActive = request.IsActive;
            asset.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updated = await _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .Include(a => a.Assignments)
                .Include(a => a.ServiceRecords)
                .FirstAsync(a => a.Id == asset.Id);

            return Ok(MapAssetDetail(updated));
        }

        [HttpPost("{id:int}/assignments")]
        public async Task<ActionResult<FixedAssetAssignmentDto>> AddAssignment(int id, [FromBody] FixedAssetAssignmentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var asset = await _context.FixedAssets.FirstOrDefaultAsync(a => a.Id == id);
            if (asset == null)
            {
                return NotFound();
            }

            var assignment = new FixedAssetAssignment
            {
                AssetId = id,
                AssignedTo = request.AssignedTo,
                AssignedBy = request.AssignedBy,
                Department = request.Department,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = request.Status,
                Note = request.Note,
                CreatedAt = DateTime.UtcNow
            };

            _context.FixedAssetAssignments.Add(assignment);

            asset.AssignedTo = request.AssignedTo;
            asset.Department = request.Department;
            asset.Location = request.Location;
            asset.Status = request.Status ?? asset.Status;
            asset.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapAssignment(assignment));
        }

        [HttpPost("{id:int}/service-records")]
        public async Task<ActionResult<FixedAssetServiceRecordDto>> AddServiceRecord(int id, [FromBody] FixedAssetServiceRecordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var assetExists = await _context.FixedAssets.AnyAsync(a => a.Id == id);
            if (!assetExists)
            {
                return NotFound();
            }

            var record = new FixedAssetServiceRecord
            {
                AssetId = id,
                ServiceDate = request.ServiceDate,
                Vendor = request.Vendor,
                Description = request.Description,
                Cost = request.Cost,
                NextServiceDate = request.NextServiceDate,
                DocumentNumber = request.DocumentNumber,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.FixedAssetServiceRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(MapServiceRecord(record));
        }

        [HttpGet("reports/summary")]
        public async Task<ActionResult<List<FixedAssetSummaryDto>>> GetSummary()
        {
            var summary = await _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .GroupBy(a => new { a.CategoryId, a.Category.Name })
                .Select(group => new FixedAssetSummaryDto
                {
                    CategoryId = group.Key.CategoryId,
                    CategoryName = group.Key.Name,
                    TotalAssets = group.Count(),
                    ActiveAssets = group.Count(a => a.IsActive),
                    AssignedAssets = group.Count(a => a.AssignedTo != null && a.AssignedTo != ""),
                    TotalPurchasePrice = group.Sum(a => a.PurchasePrice)
                })
                .OrderByDescending(item => item.TotalAssets)
                .ToListAsync();

            return Ok(summary);
        }

        [HttpGet("reports/advanced")]
        public async Task<ActionResult<List<FixedAssetAdvancedReportItem>>> GetAdvancedReport(
            [FromQuery] int? categoryId,
            [FromQuery] string? status,
            [FromQuery] string? department,
            [FromQuery] string? location,
            [FromQuery] string? supplier,
            [FromQuery] string? assignedTo,
            [FromQuery] DateTime? purchaseDateFrom,
            [FromQuery] DateTime? purchaseDateTo,
            [FromQuery] decimal? priceMin,
            [FromQuery] decimal? priceMax,
            [FromQuery] int? amortizationMin,
            [FromQuery] int? amortizationMax)
        {
            var query = _context.FixedAssets
                .AsNoTracking()
                .Include(a => a.Category)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(a => a.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(a => a.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(department))
            {
                query = query.Where(a => a.Department != null && a.Department.Contains(department));
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                query = query.Where(a => a.Location != null && a.Location.Contains(location));
            }

            if (!string.IsNullOrWhiteSpace(supplier))
            {
                query = query.Where(a => a.Supplier.Contains(supplier));
            }

            if (!string.IsNullOrWhiteSpace(assignedTo))
            {
                query = query.Where(a => a.AssignedTo != null && a.AssignedTo.Contains(assignedTo));
            }

            if (purchaseDateFrom.HasValue)
            {
                query = query.Where(a => a.PurchaseDate >= purchaseDateFrom.Value);
            }

            if (purchaseDateTo.HasValue)
            {
                query = query.Where(a => a.PurchaseDate <= purchaseDateTo.Value);
            }

            if (priceMin.HasValue)
            {
                query = query.Where(a => a.PurchasePrice >= priceMin.Value);
            }

            if (priceMax.HasValue)
            {
                query = query.Where(a => a.PurchasePrice <= priceMax.Value);
            }

            if (amortizationMin.HasValue)
            {
                query = query.Where(a => a.AmortizationYears.HasValue && a.AmortizationYears >= amortizationMin.Value);
            }

            if (amortizationMax.HasValue)
            {
                query = query.Where(a => a.AmortizationYears.HasValue && a.AmortizationYears <= amortizationMax.Value);
            }

            var report = await query
                .OrderByDescending(a => a.PurchaseDate)
                .Select(a => new FixedAssetAdvancedReportItem
                {
                    Id = a.Id,
                    Name = a.Name,
                    InventoryNumber = a.InventoryNumber,
                    SerialNumber = a.SerialNumber,
                    CategoryName = a.Category.Name,
                    Supplier = a.Supplier,
                    Status = a.Status,
                    Department = a.Department,
                    Location = a.Location,
                    AssignedTo = a.AssignedTo,
                    PurchasePrice = a.PurchasePrice,
                    PurchaseDate = a.PurchaseDate,
                    AmortizationYears = a.AmortizationYears,
                    DepreciatedValue = CalculateDepreciatedValue(a.PurchasePrice, a.PurchaseDate, a.AmortizationYears)
                })
                .ToListAsync();

            return Ok(report);
        }

        private static FixedAssetCategoryDto MapCategory(FixedAssetCategory category)
        {
            return new FixedAssetCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId
            };
        }

        private static FixedAssetAssignmentDto MapAssignment(FixedAssetAssignment assignment)
        {
            return new FixedAssetAssignmentDto
            {
                Id = assignment.Id,
                AssignedTo = assignment.AssignedTo,
                AssignedBy = assignment.AssignedBy,
                Department = assignment.Department,
                Location = assignment.Location,
                StartDate = assignment.StartDate,
                EndDate = assignment.EndDate,
                Status = assignment.Status,
                Note = assignment.Note
            };
        }

        private static FixedAssetServiceRecordDto MapServiceRecord(FixedAssetServiceRecord record)
        {
            return new FixedAssetServiceRecordDto
            {
                Id = record.Id,
                ServiceDate = record.ServiceDate,
                Vendor = record.Vendor,
                Description = record.Description,
                Cost = record.Cost,
                NextServiceDate = record.NextServiceDate,
                DocumentNumber = record.DocumentNumber,
                Status = record.Status
            };
        }

        private static FixedAssetDetailDto MapAssetDetail(FixedAsset asset)
        {
            return new FixedAssetDetailDto
            {
                Id = asset.Id,
                CategoryId = asset.CategoryId,
                CategoryName = asset.Category.Name,
                Name = asset.Name,
                Description = asset.Description,
                InventoryNumber = asset.InventoryNumber,
                SerialNumber = asset.SerialNumber,
                PurchasePrice = asset.PurchasePrice,
                Supplier = asset.Supplier,
                PurchaseDate = asset.PurchaseDate,
                WarrantyUntil = asset.WarrantyUntil,
                AmortizationYears = asset.AmortizationYears,
                DepreciatedValue = CalculateDepreciatedValue(asset.PurchasePrice, asset.PurchaseDate, asset.AmortizationYears),
                Location = asset.Location,
                Department = asset.Department,
                Status = asset.Status,
                AssignedTo = asset.AssignedTo,
                Notes = asset.Notes,
                IsActive = asset.IsActive,
                Assignments = asset.Assignments.OrderByDescending(a => a.StartDate).Select(MapAssignment).ToList(),
                ServiceRecords = asset.ServiceRecords.OrderByDescending(s => s.ServiceDate).Select(MapServiceRecord).ToList()
            };
        }

        private static decimal CalculateDepreciatedValue(decimal purchasePrice, DateTime purchaseDate, int? amortizationYears)
        {
            if (!amortizationYears.HasValue || amortizationYears.Value <= 0)
            {
                return purchasePrice;
            }

            var totalYears = amortizationYears.Value;
            var daysInUse = (DateTime.UtcNow.Date - purchaseDate.Date).TotalDays;
            var yearsInUse = Math.Min(totalYears, daysInUse / 365.25);
            var yearlyDepreciation = purchasePrice / totalYears;
            var depreciatedValue = purchasePrice - yearlyDepreciation * (decimal)yearsInUse;

            return Math.Max(0, decimal.Round(depreciatedValue, 2));
        }
    }
}
