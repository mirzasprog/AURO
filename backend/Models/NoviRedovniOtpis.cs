using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class NoviRedovniOtpis 
    {
        public string? Sifra { get; set; }
        public string? ProvedenoSnizenje { get; set; }
        public string Razlog { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,4)")]
        public decimal Kolicina { get; set; }
        public DateTime? DatumIstekaRoka { get; set; } = null;
    }
}