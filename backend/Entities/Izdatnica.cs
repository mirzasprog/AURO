using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Izdatnica
    {
        public int Id { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public int ProdavnicaId { get; set; }
        public string Razlog { get; set; } = null!;
        public int ArtikalId { get; set; }
        public decimal Kolicina { get; set; }
        public string? Komentar { get; set; }
        public string? BrojIzdatnice { get; set; }
        public DateTime? DatumIzradeIzdatnice { get; set; }
        public decimal? UkupnaVrijednost { get; set; }

        public virtual Artikal Artikal { get; set; } = null!;
        public virtual Prodavnica Prodavnica { get; set; } = null!;
    }
}
