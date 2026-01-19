using System;

namespace backend.Entities
{
    public partial class VipStavke
    {
        public int Id { get; set; }
        public string? SifraArtikla { get; set; }
        public string? NazivArtikla { get; set; }
        public decimal Kolicina { get; set; }
        public string? Prodavnica { get; set; }
        public int? VipZaglavljeId { get; set; }
        public DateTime? VrijemeUnosaSaSourcea { get; set; }
        public DateTime? VrijemeUnosaIzProdavnice { get; set; }
        public string? Komentar { get; set; }

        public virtual VipZaglavlje? VipZaglavlje { get; set; }
    }
}
