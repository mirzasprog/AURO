using System;

namespace backend.Models.Shifts
{
    public class ShiftDto
    {
        public int ShiftId { get; set; }
        public int StoreId { get; set; }
        public string? StoreLabel { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public string ShiftType { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class ShiftEmployeeDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Role { get; set; }
    }

    public class ShiftCreateRequest
    {
        public int StoreId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public string ShiftType { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }

    public class ShiftUpdateRequest
    {
        public int StoreId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public string ShiftType { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }

    public class ShiftCopyWeekRequest
    {
        public int StoreId { get; set; }
        public DateTime SourceWeekStart { get; set; }
        public DateTime TargetWeekStart { get; set; }
        public bool Overwrite { get; set; }
    }

    public class ShiftPublishRequest
    {
        public int StoreId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }

    public class ShiftMutationResponse
    {
        public ShiftDto Shift { get; set; } = new();
        public string? Warning { get; set; }
    }

    public class ShiftRequestDto
    {
        public int RequestId { get; set; }
        public int StoreId { get; set; }
        public string? StoreLabel { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string Type { get; set; } = string.Empty;
        public int? RelatedShiftId { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? Message { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ManagerNote { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }

    public class ShiftRequestCreateRequest
    {
        public int StoreId { get; set; }
        public int EmployeeId { get; set; }
        public string Type { get; set; } = string.Empty;
        public int? RelatedShiftId { get; set; }
        public DateTime? RequestedDate { get; set; }
        public string? Message { get; set; }
    }

    public class ShiftRequestDecisionRequest
    {
        public string? ManagerNote { get; set; }
    }

    public class ShiftQueryParameters
    {
        public int? StoreId { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int? EmployeeId { get; set; }
        public string? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }
}
