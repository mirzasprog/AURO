using System.Collections.Generic;

namespace backend.Models.Dashboard
{
    public class DashboardKpiDto
    {
        public string Key { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string FormattedValue { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public IReadOnlyCollection<DashboardTrendPointDto> Trend { get; set; } = new List<DashboardTrendPointDto>();
    }
}
