using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class DetaljiRedovnogOtpisaOdbijeno {
        
        public string Sifra { get; set; } = null!;
        public string? Barkod { get; set; }
        public string Naziv { get; set; } = null!;
        public string ProvedenoSnizenje { get; set; } = null!;
        public string RazlogOtpisa { get; set; } = null!;
        
        public string JedinicaMjere { get; set; } = null!;
        [Precision(18,2)]
        public decimal Kolicina { get; set; }

        [Precision(18,2)]
        public decimal NabavnaVrijednost { get; set; }

        [Precision(18,2)]
        public decimal UkupnaVrijednost { get; set; }
        public string Dobavljac {get; set; } = null!;

        public string? Odbio { get; set; } = null;
        public string? Komentar { get; set; } = null;
        public string? KomentarOtpis { get; set; } = null;

    }
}
