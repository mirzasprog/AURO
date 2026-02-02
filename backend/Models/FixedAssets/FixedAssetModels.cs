using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.FixedAssets
{
    public class FixedAssetCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public List<FixedAssetCategoryDto> Children { get; set; } = new();
    }

    public class FixedAssetCategoryRequest
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(400)]
        public string? Description { get; set; }

        public int? ParentCategoryId { get; set; }
    }

    public class FixedAssetListItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string InventoryNumber { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string? Location { get; set; }
        public string? AssignedTo { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? AmortizationYears { get; set; }
        public decimal DepreciatedValue { get; set; }
    }

    public class FixedAssetDetailDto
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string InventoryNumber { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; }
        public string Supplier { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public DateTime? WarrantyUntil { get; set; }
        public int? AmortizationYears { get; set; }
        public decimal DepreciatedValue { get; set; }
        public string? Location { get; set; }
        public string? Department { get; set; }
        public string? Status { get; set; }
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
        public List<FixedAssetAssignmentDto> Assignments { get; set; } = new();
        public List<FixedAssetServiceRecordDto> ServiceRecords { get; set; } = new();
    }

    public class FixedAssetRequest
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string InventoryNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string SerialNumber { get; set; } = string.Empty;

        [Required]
        public decimal PurchasePrice { get; set; }

        [Required]
        [MaxLength(200)]
        public string Supplier { get; set; } = string.Empty;

        [Required]
        public DateTime PurchaseDate { get; set; }

        public DateTime? WarrantyUntil { get; set; }

        [Range(1, 100)]
        public int? AmortizationYears { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; }

        [MaxLength(150)]
        public string? Department { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        [MaxLength(150)]
        public string? AssignedTo { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class FixedAssetAssignmentRequest
    {
        [Required]
        [MaxLength(150)]
        public string AssignedTo { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? AssignedBy { get; set; }

        [MaxLength(150)]
        public string? Department { get; set; }

        [MaxLength(150)]
        public string? Location { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }

        [MaxLength(500)]
        public string? Note { get; set; }
    }

    public class FixedAssetAssignmentDto
    {
        public int Id { get; set; }
        public string AssignedTo { get; set; } = string.Empty;
        public string? AssignedBy { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
    }

    public class FixedAssetServiceRecordRequest
    {
        [Required]
        public DateTime ServiceDate { get; set; }

        [MaxLength(200)]
        public string? Vendor { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public decimal? Cost { get; set; }

        public DateTime? NextServiceDate { get; set; }

        [MaxLength(100)]
        public string? DocumentNumber { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }
    }

    public class FixedAssetServiceRecordDto
    {
        public int Id { get; set; }
        public DateTime ServiceDate { get; set; }
        public string? Vendor { get; set; }
        public string? Description { get; set; }
        public decimal? Cost { get; set; }
        public DateTime? NextServiceDate { get; set; }
        public string? DocumentNumber { get; set; }
        public string? Status { get; set; }
    }

    public class FixedAssetSummaryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int TotalAssets { get; set; }
        public int ActiveAssets { get; set; }
        public int AssignedAssets { get; set; }
        public decimal TotalPurchasePrice { get; set; }
    }

    public class FixedAssetAdvancedReportItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string InventoryNumber { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string Supplier { get; set; } = string.Empty;
        public string? Status { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? AssignedTo { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? AmortizationYears { get; set; }
        public decimal DepreciatedValue { get; set; }
    }
}
