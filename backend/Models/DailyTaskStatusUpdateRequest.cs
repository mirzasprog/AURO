using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class DailyTaskStatusUpdateRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;

        public string? CompletionNote { get; set; }

        public IFormFile? Image { get; set; }

        public bool RemoveImage { get; set; }
    }
}
