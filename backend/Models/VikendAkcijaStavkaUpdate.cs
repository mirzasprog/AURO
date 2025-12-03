namespace backend.Models
{
    public class VikendAkcijaStavkaUpdate
    {
        public string? Id { get; set; }
        public string? VikendAkcijaId { get; set; }
        public string SifraArtikla { get; set; } = string.Empty;
        public string? NazivArtikla { get; set; }
        public decimal Kolicina { get; set; }
        public string? BrojProdavnice { get; set; }
    }
}
