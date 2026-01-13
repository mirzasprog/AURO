namespace backend.Models.Shifts
{
    public class ShiftOptions
    {
        public const string SectionName = "ShiftSettings";
        public int MinimumRestHours { get; set; } = 11;
        public int MaxWeeklyHours { get; set; } = 40;
    }
}
