namespace backend.Models.Prometi {
    public class ArtikliNaRacunuResponse {
        public string SifraArtikla { get; set; } = null!;
        public string NazivArtikla { get; set; } = null!;
        public decimal Cijena { get; set; }
    }
}