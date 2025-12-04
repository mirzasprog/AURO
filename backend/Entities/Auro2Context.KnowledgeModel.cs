using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        private static float ParseFloatOrDefault(string value) => float.TryParse(value, out var parsed) ? parsed : 0f;

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            var floatArrayConverter = new ValueConverter<float[], string>(
                v => string.Join(',', v ?? Array.Empty<float>()),
                v => string.IsNullOrWhiteSpace(v)
                    ? Array.Empty<float>()
                    : v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(ParseFloatOrDefault)
                        .ToArray());

            modelBuilder.Entity<KnowledgeDocument>(entity =>
            {
                entity.ToTable("KnowledgeDocuments");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.SourceType)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.Department)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.Tags)
                    .HasMaxLength(512);

                entity.Property(e => e.CreatedAt);

                entity.Property(e => e.ImportedAt);

                entity.Property(e => e.Version)
                    .HasMaxLength(64);

                entity.HasMany(e => e.Chunks)
                    .WithOne(c => c.Document)
                    .HasForeignKey(c => c.DocumentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<KnowledgeChunk>(entity =>
            {
                entity.ToTable("KnowledgeChunks");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Content)
                    .IsRequired();

                entity.Property(e => e.Embedding)
                    .HasConversion(floatArrayConverter)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Order);

                entity.Property(e => e.SectionTitle)
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<ChatConversation>(entity =>
            {
                entity.ToTable("ChatConversations");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasMany(e => e.Messages)
                    .WithOne(m => m.Conversation)
                    .HasForeignKey(m => m.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.ToTable("ChatMessages");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(32);

                entity.Property(e => e.Content)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
