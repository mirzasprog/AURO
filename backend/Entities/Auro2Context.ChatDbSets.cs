using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<ChatConversation> ChatConversations { get; set; } = null!;

        public virtual DbSet<ChatMessage> ChatMessages { get; set; } = null!;
    }
}
