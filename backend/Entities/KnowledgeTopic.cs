using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    [Table("KnowledgeTopics")]
    public class KnowledgeTopic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Tema { get; set; } = string.Empty;

        [Required]
        public string Upute { get; set; } = string.Empty;
    }
}
