using System;

namespace backend.Entities
{
    public partial class FixedAssetAssignment
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public string AssignedTo { get; set; } = null!;
        public string? AssignedBy { get; set; }
        public string? Department { get; set; }
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual FixedAsset Asset { get; set; } = null!;
    }
}
