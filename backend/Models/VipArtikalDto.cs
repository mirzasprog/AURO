namespace backend.Models
{
    public class VipArtikalDto
    {
        public int Id { get; set; }
        public string? IdAkcije { get; set; }
        public string? NazivArtk { get; set; }
        public string? SifraArtk { get; set; }
        public string? BarKod { get; set; }
        public string? Dobavljac { get; set; }
        public decimal? AsSa { get; set; }
        public decimal? AsMo { get; set; }
        public decimal? AsBl { get; set; }
        public string? Opis { get; set; }
        public string? Status { get; set; }
        public decimal? AkcijskaMpc { get; set; }
        public decimal? Zaliha { get; set; }
    }
}
