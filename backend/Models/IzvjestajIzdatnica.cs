using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class IzvjestajIzdatnica {
        public string BrojProdavnice { get; set; } = String.Empty;
        public string BrojIzdatnice { get; set; } = String.Empty;
        public string Kategorija { get; set; } = String.Empty;
        public string SifraArtikla { get; set; } = String.Empty;
        public string Snizenje { get; set; } = String.Empty;
        public string Razlog { get; set; } = String.Empty;
        public string JedinicaMjere { get; set; } = String.Empty;
        public string Pkol { get; set; } = String.Empty;

        [Precision(18,2)]
        public decimal Mpc { get; set; }

        [Precision(18,2)]
        public decimal UkupnaVrijednost { get; set; }
        public string DatumPopunjavanja { get; set; } = String.Empty;
        public string SifraDobavljaca { get; set; } = String.Empty;
        public string NazivDobavljaca { get; set; } = String.Empty;
    }
}