using System;

namespace backend.Entities
{
    public class ShiftRequest
    {
        public int RequestId { get; set; }
        public int StoreId { get; set; }
        public int EmployeeId { get; set; }
        public string Type { get; set; } = null!;
        public int? RelatedShiftId { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = null!;
        public string? ManagerNote { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }

        public virtual Prodavnica Store { get; set; } = null!;
        public virtual Korisnik Employee { get; set; } = null!;
        public virtual Shift? RelatedShift { get; set; }
    }
}
