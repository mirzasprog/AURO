using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class ChatResponseDto
    {
        public Guid ConversationId { get; set; }

        public string Answer { get; set; } = string.Empty;

        public IReadOnlyList<ChatSourceDto> Sources { get; set; } = new List<ChatSourceDto>();
    }
}
