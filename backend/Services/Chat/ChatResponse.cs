using System;
using System.Collections.Generic;

namespace backend.Services.Chat
{
    public class ChatResponse
    {
        public Guid ConversationId { get; set; }

        public string Answer { get; set; } = string.Empty;

        public IReadOnlyList<ChatChunkReference> UsedChunks { get; set; } = new List<ChatChunkReference>();
    }
}
