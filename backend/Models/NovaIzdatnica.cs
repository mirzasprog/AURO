using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class NovaIzdatnica {
        //public DateTime Datum { get; set; }
        public string Sifra { get; set; } = null!;
        public string Razlog { get; set; } = null!;
        [Precision(18,2)]
        public decimal Kolicina { get; set; }
        public string? Komentar { get; set; } = null!;
        public DateTime DatumIzradeIzdatnice {get; set;}
        [Precision(18,2)]
        public decimal UkupnaVrijednost {get; set;}
        
    }
}