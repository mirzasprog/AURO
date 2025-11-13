using System.Collections.Generic;

namespace backend.Models.Dashboard
{
    public class CategoryShareSummaryDto
    {
        public decimal VipShare { get; set; }
        public IReadOnlyCollection<CategoryShareDto> Categories { get; set; } = new List<CategoryShareDto>();
    }
}
