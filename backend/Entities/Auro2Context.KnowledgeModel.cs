using System;
using System.Linq;
using System.Text.Json;
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

            modelBuilder.Entity<KnowledgeBaseDocument>(entity =>
            {
                var jsonConverter = new ValueConverter<float[], string>(
                    v => JsonSerializer.Serialize(v ?? Array.Empty<float>(), (JsonSerializerOptions?)null),
                    v => string.IsNullOrWhiteSpace(v)
                        ? Array.Empty<float>()
                        : JsonSerializer.Deserialize<float[]>(v, (JsonSerializerOptions?)null) ?? Array.Empty<float>());

                entity.ToTable("KnowledgeDocumentsRag");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Content)
                    .IsRequired();

                entity.Property(e => e.Embedding)
                    .HasConversion(jsonConverter)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
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

            modelBuilder.Entity<ServiceInvoice>(entity =>
            {
                entity.ToTable("ServiceInvoices");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.InvoiceNumber)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.InvoiceDate)
                    .HasColumnType("date");

                entity.Property(e => e.DueDate)
                    .HasColumnType("date");

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.CustomerAddress)
                    .HasMaxLength(256);

                entity.Property(e => e.CustomerCity)
                    .HasMaxLength(128);

                entity.Property(e => e.CustomerCountry)
                    .HasMaxLength(128);

                entity.Property(e => e.CustomerTaxId)
                    .HasMaxLength(64);

                entity.Property(e => e.Currency)
                    .IsRequired()
                    .HasMaxLength(8);

                entity.Property(e => e.SubtotalAmount)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.TaxAmount)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.TotalAmount)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Notes)
                    .HasMaxLength(1024);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(64)
                    .HasDefaultValue("Kreirano");

                entity.HasMany(e => e.Items)
                    .WithOne(i => i.ServiceInvoice)
                    .HasForeignKey(i => i.ServiceInvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ServiceInvoiceItem>(entity =>
            {
                entity.ToTable("ServiceInvoiceItems");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Quantity)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UnitPrice)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.TaxRate)
                    .HasColumnType("decimal(5, 2)");

                entity.Property(e => e.LineTotalWithoutTax)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LineTaxAmount)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LineTotalWithTax)
                    .HasColumnType("decimal(18, 2)");
            });
        }
    }
}
