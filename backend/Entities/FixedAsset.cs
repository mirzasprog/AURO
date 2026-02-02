using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class FixedAsset
    {
        public FixedAsset()
        {
            Assignments = new HashSet<FixedAssetAssignment>();
            ServiceRecords = new HashSet<FixedAssetServiceRecord>();
        }

        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string InventoryNumber { get; set; } = null!;
        public string SerialNumber { get; set; } = null!;
        public decimal PurchasePrice { get; set; }
        public string Supplier { get; set; } = null!;
        public DateTime PurchaseDate { get; set; }
        public DateTime? WarrantyUntil { get; set; }
        public int? AmortizationYears { get; set; }
        public string? Location { get; set; }
        public string? Department { get; set; }
        public string? Status { get; set; }
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual FixedAssetCategory Category { get; set; } = null!;
        public virtual ICollection<FixedAssetAssignment> Assignments { get; set; }
        public virtual ICollection<FixedAssetServiceRecord> ServiceRecords { get; set; }
    }
}
