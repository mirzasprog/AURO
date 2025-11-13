using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class ArtikliNeuslovneRobeDetalji {

        public string Sifra { get; set; } = null!;
        public string? Barkod { get; set; } = null!;
        public string Naziv { get; set; } = null!;
        public string RazlogNeuslovnosti { get; set; } = null!;
        public string RazlogPrisustva { get; set; } = null!;
        public string OtpisPovrat { get; set; } = null!;
        public string JedinicaMjere { get; set; } = null!;
        public string Napomena { get; set; } = null!;
        [Precision(18,2)]
        public decimal Kolicina { get; set; }
        [Precision(18,2)]
        public decimal NabavnaVrijednost { get; set; }
        [Precision(18,2)]
        public decimal UkupnaVrijednost { get; set; }
        public string Dobavljac {get; set; } = null!;
    }
}