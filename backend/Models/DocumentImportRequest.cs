using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class DocumentImportRequest
    {
        [Required]
        public IFormFile? File { get; set; }

        [Required]
        public string Department { get; set; } = string.Empty;

        public string? Tags { get; set; }

        public string? Language { get; set; }
    }
}
