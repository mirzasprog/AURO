namespace backend.Models {
    public class IzvjestajTrgovackaKnjigaSintetika {
        public int Rbr { get; set; }
        public string Datum { get; set; } = String.Empty;
        public string Opis { get; set; } = String.Empty;
        public string UkupnoNaknadaSaPDV { get; set; } = String.Empty;
    }
}