using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class PDTIzdatnicaTroska
    {
        public string Sifra { get; set; } = String.Empty;
        [Precision(18, 2)]
        public decimal NabavnaCijena { get; set; }
        public double Kolicina { get; set; }
        public string Naziv { get; set; } = String.Empty;
        public string Razlog { get; set; } = String.Empty;
        [Precision(18, 2)]
        public decimal UkupnaVrijednostMPC { get; set; }
        [Precision(18, 2)]
        public decimal UkupnaVrijednostNC { get; set; }
        [Precision(18, 2)]
        public decimal Cijena { get; set; }
        public string JedinicaMjere { get; set; } = String.Empty;
        public string DatumIzradeIzdatnice { get; set; } = String.Empty;
    }
}