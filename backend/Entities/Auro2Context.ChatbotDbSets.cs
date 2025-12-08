using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<KnowledgeTopic> KnowledgeTopics { get; set; } = null!;

        public virtual DbSet<UnansweredQuestion> UnansweredQuestions { get; set; } = null!;
    }
}
