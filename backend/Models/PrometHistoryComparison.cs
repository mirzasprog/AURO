using System;

namespace backend.Models
{
    public class PrometHistoryComparison
    {
        public int Day { get; set; }
        public int CurrentYear { get; set; }
        public int PreviousYear { get; set; }
        public DateTime CurrentYearDate { get; set; }
        public DateTime PreviousYearDate { get; set; }
        public decimal CurrentYearTurnover { get; set; }
        public decimal PreviousYearTurnover { get; set; }
        public decimal Difference => CurrentYearTurnover - PreviousYearTurnover;
    }
}
