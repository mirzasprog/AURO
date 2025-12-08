using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<KnowledgeBaseDocument> KnowledgeBaseDocuments { get; set; } = null!;
    }
}
