using System;
using System.Collections.Generic;

namespace backend.Services.VectorStore
{
    public class VectorRecord
    {
        public Guid Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public IReadOnlyList<float> Embedding { get; set; } = Array.Empty<float>();

        public IReadOnlyDictionary<string, string> Metadata { get; set; } = new Dictionary<string, string>();
    }
}
