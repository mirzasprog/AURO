using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DailyTaskUpdateRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public bool ImageAllowed { get; set; }

        public bool IsRecurring { get; set; }
    }
}
