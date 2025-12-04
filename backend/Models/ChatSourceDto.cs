using System;

namespace backend.Models
{
    public class ChatSourceDto
    {
        public Guid ChunkId { get; set; }

        public Guid? DocumentId { get; set; }

        public string FileName { get; set; } = string.Empty;

        public string Section { get; set; } = string.Empty;
    }
}
