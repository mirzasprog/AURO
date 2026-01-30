using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DailyTaskBulkCreateRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public bool ImageAllowed { get; set; }

        public bool IsRecurring { get; set; }

        [Required]
        public string TargetType { get; set; } = string.Empty;

        public List<int>? StoreIds { get; set; }

        public string? City { get; set; }

        public int? ManagerId { get; set; }

        public string? Format { get; set; }
    }
}
