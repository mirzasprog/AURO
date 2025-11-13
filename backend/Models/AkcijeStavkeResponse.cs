namespace backend.Models {
    public class AkcijeStavkeResponse {
        public int Id { get; set; }
        public string Sifra { get; set; } = null!;
        public string Naziv { get; set; } = null!;
        public decimal Kolicina { get; set; }
        public string Prodavnica { get; set; } = null!;

    }
}