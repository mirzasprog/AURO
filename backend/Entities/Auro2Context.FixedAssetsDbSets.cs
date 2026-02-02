using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context : DbContext
    {
        public virtual DbSet<FixedAssetCategory> FixedAssetCategories { get; set; } = null!;
        public virtual DbSet<FixedAsset> FixedAssets { get; set; } = null!;
        public virtual DbSet<FixedAssetAssignment> FixedAssetAssignments { get; set; } = null!;
        public virtual DbSet<FixedAssetServiceRecord> FixedAssetServiceRecords { get; set; } = null!;
    }
}
