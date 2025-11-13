namespace backend.Models {
    public class PregledOtpisaInterna {
        public string BrojOtpisa { get; set; } = null!;
        public string Prodavnica { get; set; } = null!;
        public string DatumPopunjavanja { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string? DatumOvjerePodrucnog { get; set; } = null!;
        public string? DatumOvjereRegionalnog { get; set; } = null!;
    }
}
