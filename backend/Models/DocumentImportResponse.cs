using System;

namespace backend.Models
{
    public class DocumentImportResponse
    {
        public Guid DocumentId { get; set; }

        public int ChunkCount { get; set; }

        public string FileName { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;
    }
}
