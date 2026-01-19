namespace backend.Models
{
    public class VikendAkcijaStavkaDto
    {
        public string? Id { get; set; }
        public string? Sifra { get; set; }
        public string? Naziv { get; set; }
        public decimal Kolicina { get; set; }
        public string? Prodavnica { get; set; }
        public string? BarKod { get; set; }
        public string? Dobavljac { get; set; }
        public decimal? AsSa { get; set; }
        public decimal? AsMo { get; set; }
        public decimal? AsBl { get; set; }
        public string? Opis { get; set; }
        public string? Status { get; set; }
        public decimal? AkcijskaMpc { get; set; }
        public decimal? Zaliha { get; set; }
        public string? Komentar { get; set; }
    }
}
