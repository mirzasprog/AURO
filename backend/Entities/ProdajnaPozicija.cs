using System;

namespace backend.Entities
{
    public partial class ProdajnaPozicija
    {
        public int Id { get; set; }
        public int LayoutId { get; set; }
        public string Tip { get; set; } = null!;
        public string Naziv { get; set; } = null!;
        public string? BrojPozicije { get; set; }
        public string? Trgovac { get; set; }
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
        public DateTime? DatumKreiranja { get; set; }
        public DateTime? DatumIzmjene { get; set; }

        public virtual ProdajniLayout Layout { get; set; } = null!;
    }
}
