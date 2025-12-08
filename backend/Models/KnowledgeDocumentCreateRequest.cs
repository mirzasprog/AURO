using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class KnowledgeDocumentCreateRequest
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
