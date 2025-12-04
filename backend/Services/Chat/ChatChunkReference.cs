using System;

namespace backend.Services.Chat
{
    public class ChatChunkReference
    {
        public Guid ChunkId { get; set; }

        public Guid? DocumentId { get; set; }

        public string FileName { get; set; } = string.Empty;

        public string Section { get; set; } = string.Empty;
    }
}
