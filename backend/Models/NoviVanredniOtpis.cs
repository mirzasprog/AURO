using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class NoviVanredniOtpis 
    {
        public string Razlog { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,4)")]
        public string? PotrebnoZbrinjavanje {get; set;}
        public string? PotrebanTransport {get; set;}
        public string? Komentar {get; set;}
        public string? Sifra { get; set; }
        public decimal Kolicina { get; set; }
    }
}