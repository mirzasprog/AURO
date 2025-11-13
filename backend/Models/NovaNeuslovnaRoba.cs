namespace backend.Models {
    public class NovaNeuslovnaRoba {
        public string? SifraArtikla { get; set; }
        public decimal Kolicina { get; set; }
        public string RazlogNeuslovnosti { get; set; } = String.Empty;
        public string OtpisPovrat { get; set; } = String.Empty;
        public string RazlogPrisustva { get; set; } = String.Empty;
        public string Napomena { get; set; } = String.Empty;
    }
}