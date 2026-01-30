using System;

namespace backend.Models.ProdajnePozicije
{
    public class ProdajnaPozicijaDto
    {
        public int Id { get; set; }
        public string Tip { get; set; } = string.Empty;
        public string Naziv { get; set; } = string.Empty;
        public string? BrojPozicije { get; set; }
        public string? Trgovac { get; set; }
        public string? Trader { get; set; }
        public DateTime? ZakupDo { get; set; }
        public decimal? VrijednostZakupa { get; set; }
        public string? VrstaUgovora { get; set; }
        public string? TipPozicije { get; set; }
        public decimal Sirina { get; set; }
        public decimal Duzina { get; set; }
        public decimal PozicijaX { get; set; }
        public decimal PozicijaY { get; set; }
        public decimal Rotacija { get; set; }
        public string? Zona { get; set; }
    }
}
