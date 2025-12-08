using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ChatbotRequest
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
