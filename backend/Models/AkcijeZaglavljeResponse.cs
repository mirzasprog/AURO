namespace backend.Models {
    public class AkcijeZaglavljeResponse {
        public int Id { get; set; }
        public string NazivAkcije { get; set; } = null!;
        public DateTime Pocetak { get; set; }
        public DateTime Kraj { get; set; }

    }
}