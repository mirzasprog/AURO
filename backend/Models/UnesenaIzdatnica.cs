using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class UnesenaIzdatnica {
        public string? Sifra { get; set; }
        public string? Naziv { get; set; }

        public string? JedinicaMjere { get; set; }

        [Precision(18,2)]
        public decimal Kolicina { get; set; }

        [Precision(18,2)]
        public decimal Cijena { get; set; }

        
        [Precision(18,2)]
        public decimal UkupnaVrijednostMPC { get; set; }

        [Precision(18,2)]
        public decimal NabavnaCijena { get; set; }

        [Precision(18,2)]
        public decimal UkupnaVrijednostNC { get; set; }

        public string? Razlog { get; set; }
        public string? Komentar { get; set; }
       
       public DateTime DatumIzradeIzdatnice {get; set;}
    }
}