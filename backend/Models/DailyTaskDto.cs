using System;

namespace backend.Models
{
    public class DailyTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool ImageAllowed { get; set; }
        public string? ImageAttachment { get; set; }
        public string? CompletionNote { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? CompletedBy { get; set; }
        public string? CreatedBy { get; set; }
        public int ProdavnicaId { get; set; }
        public string? ProdavnicaBroj { get; set; }
        public string? ProdavnicaNaziv { get; set; }
        public bool IsEditable { get; set; }
        public bool IsRecurring { get; set; }
    }
}
