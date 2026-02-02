using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class FixedAssetCategory
    {
        public FixedAssetCategory()
        {
            Assets = new HashSet<FixedAsset>();
            Subcategories = new HashSet<FixedAssetCategory>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? ParentCategoryId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual FixedAssetCategory? ParentCategory { get; set; }
        public virtual ICollection<FixedAssetCategory> Subcategories { get; set; }
        public virtual ICollection<FixedAsset> Assets { get; set; }
    }
}
