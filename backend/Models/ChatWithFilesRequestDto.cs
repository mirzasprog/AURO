using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class ChatWithFilesRequestDto
    {
        public Guid? ConversationId { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;

        public List<IFormFile>? Files { get; set; }
    }
}
