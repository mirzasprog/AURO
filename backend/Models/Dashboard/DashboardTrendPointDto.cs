using System;

namespace backend.Models.Dashboard
{
    public class DashboardTrendPointDto
    {
        public DateTime Date { get; set; }
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }
}
