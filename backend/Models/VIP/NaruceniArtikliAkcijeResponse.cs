namespace backend.Models.VIP
{
    public class NaruceniArtikalAkcijeResponse
    {
        public string? Prodavnica { get; set; }
        public string? SifraArtikla { get; set; }
        public string? NazivArtikla { get; set; }
        public string? Komentar { get; set; }
        public decimal Kolicina { get; set; }
        public string? BarKod { get; set; }
        public string? Dobavljac { get; set; }
        public decimal AkcijskaMpc { get; set; }
        public string? AsSa { get; set; }
        public string? AsMo { get; set; }
        public string? AsBl { get; set; }
        public string? Status { get; set; }
        public string? IDAkcije { get; set; }
    }
}