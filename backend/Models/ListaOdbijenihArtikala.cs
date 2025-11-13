namespace backend.Models {
    public class ListaOdbijenihArtikala {
        public IEnumerable<int> Artikli { get; set; } = null!;
        public IEnumerable<string> Komentari { get; set; } = null!;
        public string BrojOtpisa { get; set; } = null!;
        //public string? Komentar { get; set; }
    }
}