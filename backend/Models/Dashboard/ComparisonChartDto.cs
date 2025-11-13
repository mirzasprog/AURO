using System.Collections.Generic;

namespace backend.Models.Dashboard
{
    public class ComparisonChartDto
    {
        public string CurrentLabel { get; set; } = string.Empty;
        public string PreviousLabel { get; set; } = string.Empty;
        public IReadOnlyCollection<DashboardTrendPointDto> Current { get; set; } = new List<DashboardTrendPointDto>();
        public IReadOnlyCollection<DashboardTrendPointDto> Previous { get; set; } = new List<DashboardTrendPointDto>();
    }
}
