using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class ZahtjeviRedovniOtpisDetalji {
       // public string BrojOtpisa { get; set; } = null!;
       public int ArtikalId {get; set;}
        public string Sifra { get; set; } = null!;
        public string RazlogOtpisa { get; set; } = null!;

        [Precision(18,2)]
        public decimal Kolicina { get; set; }
        public string NazivArtikla { get; set; } = null!;
        public string DatumPopunjavanja { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string Dobavljac { get; set; } = null!;

        [Precision(18, 2)]
        public decimal NabavnaVrijednost { get; set; }

        [Precision(18, 2)]
        public decimal UkupnaVrijednost { get; set; }
        
    }
}