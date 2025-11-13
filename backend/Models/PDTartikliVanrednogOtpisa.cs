using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class PDTartikliVanrednogOtpisa
    {
       // public double RedniBroj { get; set; }

        public string Sifra { get; set; } = String.Empty;

        [Precision(18, 2)]
        public decimal NabavnaVrijednost { get; set; }

        //[Precision(18, 2)]
        public double Kolicina { get; set; }
        public string Naziv { get; set; } = String.Empty;

        [Precision(18, 2)]
        public decimal UkupnaVrijednost { get; set; }
        public string Razlog { get; set; } = String.Empty;
        public string PotrebanTransport { get; set; } = String.Empty;
        public string PotrebnoZbrinjavanje { get; set; } = String.Empty;
        public string JedinicaMjere { get; set; } = String.Empty;
        // public string? ProvedenoSnizenje { get; set; } = null;
        
    }
}