using System;

namespace backend.Entities
{
    public class KnowledgeChunk
    {
        public Guid Id { get; set; }

        public Guid DocumentId { get; set; }

        public string Content { get; set; } = string.Empty;

        public float[] Embedding { get; set; } = Array.Empty<float>();

        public int? Order { get; set; }

        public string? SectionTitle { get; set; }

        public KnowledgeDocument? Document { get; set; }
    }
}
