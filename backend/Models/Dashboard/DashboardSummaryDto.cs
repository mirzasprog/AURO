namespace backend.Models.Dashboard
{
    public class DashboardSummaryDto
    {
        public DashboardKpiDto Visitors { get; set; } = new DashboardKpiDto();
        public DashboardKpiDto Turnover { get; set; } = new DashboardKpiDto();
        public DashboardKpiDto Shrinkage { get; set; } = new DashboardKpiDto();
        public DashboardKpiDto AverageBasket { get; set; } = new DashboardKpiDto();
        public CategoryShareSummaryDto CategoryShare { get; set; } = new CategoryShareSummaryDto();
        public ComparisonChartDto DayOnDay { get; set; } = new ComparisonChartDto();
        public ComparisonChartDto MonthOnMonth { get; set; } = new ComparisonChartDto();
    }
}
