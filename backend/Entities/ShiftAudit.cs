using System;

namespace backend.Entities
{
    public class ShiftAudit
    {
        public int AuditId { get; set; }
        public string EntityName { get; set; } = null!;
        public string EntityId { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string? BeforeJson { get; set; }
        public string? AfterJson { get; set; }
        public int? ActorUserId { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
