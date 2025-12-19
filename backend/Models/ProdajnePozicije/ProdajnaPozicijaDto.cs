namespace backend.Models.ProdajnePozicije
{
    public class ProdajnaPozicijaDto
    {
        public int Id { get; set; }
        public string Tip { get; set; } = string.Empty;
        public string Naziv { get; set; } = string.Empty;
        public decimal Sirina { get; set; }
        public decimal Duzina { get; set; }
        public decimal PozicijaX { get; set; }
        public decimal PozicijaY { get; set; }
        public decimal Rotacija { get; set; }
        public string? Zona { get; set; }
    }
}
