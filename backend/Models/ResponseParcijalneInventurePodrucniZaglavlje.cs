namespace backend.Entities
{
    public partial class ResponseParcijalneInventurePodrucniZaglavlje
    {
        public string BrojProd { get; set; } = null!;
        public string? Datum { get; set; } = null;
        public string? Status { get; set; } = null!;
        public string? VrstaInventure { get; set; } = null!;
        public string? Podrucni { get; set; } = null!;
        public string? Napomena { get; set; } = null!;
        public string? BrojDokumenta { get; set; } = null!;
        public decimal? Ukupno { get; set; }

    }
}
