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

            modelBuilder.Entity<FixedAssetCategory>(entity =>
            {
                entity.ToTable("FixedAssetCategories");

                entity.Property(e => e.Name)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(e => e.Description)
                    .HasMaxLength(400);

                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime2");

                entity.HasOne(e => e.ParentCategory)
                    .WithMany(e => e.Subcategories)
                    .HasForeignKey(e => e.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<FixedAsset>(entity =>
            {
                entity.ToTable("FixedAssets");

                entity.Property(e => e.Name)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.InventoryNumber)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.SerialNumber)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.PurchasePrice)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Supplier)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(e => e.Location)
                    .HasMaxLength(150);

                entity.Property(e => e.Department)
                    .HasMaxLength(150);

                entity.Property(e => e.Status)
                    .HasMaxLength(50);

                entity.Property(e => e.AssignedTo)
                    .HasMaxLength(150);

                entity.Property(e => e.Notes)
                    .HasMaxLength(1000);

                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2")
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime2");

                entity.HasOne(e => e.Category)
                    .WithMany(e => e.Assets)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<FixedAssetAssignment>(entity =>
            {
                entity.ToTable("FixedAssetAssignments");

                entity.Property(e => e.AssignedTo)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(e => e.AssignedBy)
                    .HasMaxLength(150);

                entity.Property(e => e.Department)
                    .HasMaxLength(150);

                entity.Property(e => e.Location)
                    .HasMaxLength(150);

                entity.Property(e => e.Status)
                    .HasMaxLength(50);

                entity.Property(e => e.Note)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2")
                    .HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Asset)
                    .WithMany(e => e.Assignments)
                    .HasForeignKey(e => e.AssetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<FixedAssetServiceRecord>(entity =>
            {
                entity.ToTable("FixedAssetServiceRecords");

                entity.Property(e => e.Vendor)
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.Cost)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(100);

                entity.Property(e => e.Status)
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2")
                    .HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Asset)
                    .WithMany(e => e.ServiceRecords)
                    .HasForeignKey(e => e.AssetId)
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

                entity.Property(e => e.ServiceId)
                    .IsRequired();

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

            modelBuilder.Entity<Shift>(entity =>
            {
                entity.ToTable("Shift");

                entity.HasKey(e => e.ShiftId);

                entity.Property(e => e.ShiftId)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.ShiftDate)
                    .HasColumnType("date");

                entity.Property(e => e.StartTime)
                    .HasColumnType("time");

                entity.Property(e => e.EndTime)
                    .HasColumnType("time");

                entity.Property(e => e.BreakMinutes)
                    .HasDefaultValue(0);

                entity.Property(e => e.ShiftType)
                    .HasMaxLength(32);

                entity.Property(e => e.Status)
                    .HasMaxLength(32);

                entity.Property(e => e.Note)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime2");

                entity.Property(e => e.IsDeleted)
                    .HasDefaultValue(false);

                entity.HasOne(d => d.Store)
                    .WithMany()
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_Shift_Prodavnica");

                entity.HasIndex(e => new { e.StoreId, e.ShiftDate })
                    .HasDatabaseName("IX_Shift_StoreId_ShiftDate");

                entity.HasIndex(e => new { e.EmployeeId, e.ShiftDate })
                    .HasDatabaseName("IX_Shift_EmployeeId_ShiftDate");

                entity.HasIndex(e => e.Status)
                    .HasDatabaseName("IX_Shift_Status");
            });

            modelBuilder.Entity<ShiftRequest>(entity =>
            {
                entity.ToTable("ShiftRequest");

                entity.HasKey(e => e.RequestId);

                entity.Property(e => e.RequestId)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Type)
                    .HasMaxLength(32);

                entity.Property(e => e.Message)
                    .HasMaxLength(500);

                entity.Property(e => e.Status)
                    .HasMaxLength(32);

                entity.Property(e => e.ManagerNote)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime2");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime2");

                entity.Property(e => e.ApprovedAt)
                    .HasColumnType("datetime2");

                entity.HasOne(d => d.Store)
                    .WithMany()
                    .HasForeignKey(d => d.StoreId)
                    .HasConstraintName("FK_ShiftRequest_Prodavnica");

                entity.HasOne(d => d.Employee)
                    .WithMany()
                    .HasForeignKey(d => d.EmployeeId)
                    .HasConstraintName("FK_ShiftRequest_Korisnik");

                entity.HasOne(d => d.RelatedShift)
                    .WithMany()
                    .HasForeignKey(d => d.RelatedShiftId)
                    .HasConstraintName("FK_ShiftRequest_Shift");

                entity.HasIndex(e => new { e.StoreId, e.Status })
                    .HasDatabaseName("IX_ShiftRequest_StoreId_Status");
            });

            modelBuilder.Entity<ShiftAudit>(entity =>
            {
                entity.ToTable("ShiftAudit");

                entity.HasKey(e => e.AuditId);

                entity.Property(e => e.AuditId)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.EntityName)
                    .HasMaxLength(64);

                entity.Property(e => e.EntityId)
                    .HasMaxLength(64);

                entity.Property(e => e.Action)
                    .HasMaxLength(32);

                entity.Property(e => e.BeforeJson)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.AfterJson)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Timestamp)
                    .HasColumnType("datetime2");
            });
        }
    }
}
