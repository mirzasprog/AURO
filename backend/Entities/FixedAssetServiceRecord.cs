using System;

namespace backend.Entities
{
    public partial class FixedAssetServiceRecord
    {
        public int Id { get; set; }
        public int AssetId { get; set; }
        public DateTime ServiceDate { get; set; }
        public string? Vendor { get; set; }
        public string? Description { get; set; }
        public decimal? Cost { get; set; }
        public DateTime? NextServiceDate { get; set; }
        public string? DocumentNumber { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual FixedAsset Asset { get; set; } = null!;
    }
}
