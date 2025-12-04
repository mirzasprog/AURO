using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public class KnowledgeDocument
    {
        public Guid Id { get; set; }

        public string FileName { get; set; } = string.Empty;

        public string SourceType { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public string? Tags { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ImportedAt { get; set; }

        public string? Version { get; set; }

        public ICollection<KnowledgeChunk> Chunks { get; set; } = new List<KnowledgeChunk>();
    }
}
