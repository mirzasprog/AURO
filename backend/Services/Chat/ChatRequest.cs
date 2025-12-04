using System;
using System.Collections.Generic;

namespace backend.Services.Chat
{
    public class ChatRequest
    {
        public string UserId { get; set; } = string.Empty;

        public string Question { get; set; } = string.Empty;

        public string? DepartmentFilter { get; set; }

        public IReadOnlyList<string>? TagsFilter { get; set; }

        public Guid? ConversationId { get; set; }

        public IReadOnlyList<AdHocFileContext> FileContexts { get; set; } = new List<AdHocFileContext>();

        public int TopK { get; set; } = 5;
    }
}
