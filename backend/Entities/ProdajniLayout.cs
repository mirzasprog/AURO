using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class ProdajniLayout
    {
        public ProdajniLayout()
        {
            Pozicije = new HashSet<ProdajnaPozicija>();
        }

        public int Id { get; set; }
        public int ProdavnicaId { get; set; }
        public decimal Sirina { get; set; }
        public decimal Duzina { get; set; }
        public string? BackgroundFileName { get; set; }
        public string? BackgroundContentType { get; set; }
        public string? BackgroundData { get; set; }
        public DateTime? DatumKreiranja { get; set; }
        public DateTime? DatumIzmjene { get; set; }

        public virtual Prodavnica Prodavnica { get; set; } = null!;
        public virtual ICollection<ProdajnaPozicija> Pozicije { get; set; }
    }
}
