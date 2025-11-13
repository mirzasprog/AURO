using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class IzvjestajTrgovackaKnjigaAnalitika {
        public string Datum { get; set; } = String.Empty;
        public string Distributer { get; set; } = String.Empty;
        public int BrojTransakcija { get; set; }

        [Precision(18,2)]
        public decimal ProdajaBezPDV { get; set; }

        [Precision(18,2)]
        public decimal PDV { get; set; }

        [Precision(18,2)]
        public decimal ProdajaSaPDV { get; set; }

        [Precision(18,2)]
        public decimal Provizija { get; set; }

        [Precision(18,2)]
        public decimal PorezNaProviziju { get; set; }

        [Precision(18,2)]
        public decimal UkupnoSaPDV { get; set; }
    }
}