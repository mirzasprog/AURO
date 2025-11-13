using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class PDTNeuslovnaRoba
    {
        public string sifraArtikla { get; set; } = String.Empty;
        public string Naziv { get; set; } = String.Empty;
        [Precision(18, 2)]
        public decimal nabavnaVrijednost { get; set; }
        public double Kolicina { get; set; }
        public string razlogPrisustva { get; set; } = String.Empty;
        public string RazlogNeuslovnosti { get; set; } = String.Empty;
        public string OtpisPovrat { get; set; } = String.Empty;
        [Precision(18, 2)]
        public decimal ukupnaVrijednost { get; set; }
        public string JedinicaMjere { get; set; } = String.Empty;
    }
}