namespace backend.Models
{
    public class VikendAkcijaStavkaUpdate
    {
        public string? Id { get; set; }
        public string SifraArtikla { get; set; } = string.Empty;
        public decimal Kolicina { get; set; }
    }
}
