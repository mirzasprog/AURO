using System;

namespace backend.Entities
{
    public partial class DailyTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Type { get; set; } = null!;
        public int? CreatedById { get; set; }
        public int ProdavnicaId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = null!;
        public DateTime? CompletedAt { get; set; }
        public int? CompletedById { get; set; }
        public string? CompletionNote { get; set; }
        public bool ImageAllowed { get; set; }
        public string? ImageAttachment { get; set; }
        public int? TemplateId { get; set; }
        public bool IsRecurring { get; set; }

        public virtual Korisnik? CreatedBy { get; set; }
        public virtual Korisnik? CompletedBy { get; set; }
        public virtual Prodavnica Prodavnica { get; set; } = null!;
        public virtual DailyTaskTemplate? Template { get; set; }
    }
}
