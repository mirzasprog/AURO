using System;
using System.Collections.Generic;

namespace backend.Services.Knowledge
{
    public static class TextChunker
    {
        public static IReadOnlyList<string> Split(string content, int maxChunkSize)
        {
            if (maxChunkSize <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(maxChunkSize), "Chunk size must be positive.");
            }

            var chunks = new List<string>();
            var sanitized = content ?? string.Empty;

            for (var index = 0; index < sanitized.Length; index += maxChunkSize)
            {
                var length = Math.Min(maxChunkSize, sanitized.Length - index);
                chunks.Add(sanitized.Substring(index, length));
            }

            return chunks;
        }
    }
}
