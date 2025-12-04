using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<KnowledgeDocument> KnowledgeDocuments { get; set; } = null!;

        public virtual DbSet<KnowledgeChunk> KnowledgeChunks { get; set; } = null!;
    }
}
