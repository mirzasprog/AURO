using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DailyTaskCreateRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int ProdavnicaId { get; set; }

        public bool ImageAllowed { get; set; }
    }
}
