using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public class ChatConversation
    {
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }
}
