using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ChatRequestDto
    {
        public Guid? ConversationId { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;

        public string? Department { get; set; }

        public IReadOnlyList<string>? Tags { get; set; }
    }
}
