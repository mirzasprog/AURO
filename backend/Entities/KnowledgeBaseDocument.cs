using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    /// <summary>
    /// Represents a knowledge base document stored for RAG lookups.
    /// The embedding is stored as a serialized float array for simplicity.
    /// </summary>
    [Table("KnowledgeDocumentsRag")]
    public class KnowledgeBaseDocument
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// Stored as JSON (float array) in the database.
        /// </summary>
        [Required]
        public float[] Embedding { get; set; } = Array.Empty<float>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
