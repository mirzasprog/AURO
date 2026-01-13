using System;

namespace backend.Entities
{
    public class Shift
    {
        public int ShiftId { get; set; }
        public int StoreId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public string ShiftType { get; set; } = null!;
        public int? DepartmentId { get; set; }
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Prodavnica Store { get; set; } = null!;
        public virtual Korisnik Employee { get; set; } = null!;
    }
}
