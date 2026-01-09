using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("NarucenoIsporuceno", Schema = "VIP")]
    public class NarucenoIsporucenoResponse
    {
        [Column(TypeName = "char(3)")]
        public string? Prodavnica { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string? Narudzba { get; set; }

        public DateTime? DatumNarudzbe { get; set; }

        public DateTime? DatumPrimke { get; set; }

        [Column(TypeName = "varchar(10)")]
        public string? SifraDobavljaca { get; set; }

        [Column(TypeName = "nvarchar(250)")]
        public string? NazivArtikla { get; set; }

        public int? Naruceno { get; set; }

        public int? Isporuceno { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? Razlika { get; set; }
    }
}