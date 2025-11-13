using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class NeuslovnaRoba
    {
        public int Id { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public int ArtikalId { get; set; }
        public int ProdavnicaId { get; set; }
        public decimal Kolicina { get; set; }
        public decimal UkupnaVrijednost { get; set; }
        public string RazlogNeuslovnosti { get; set; } = null!;
        public string OtpisPovrat { get; set; } = null!;
        public string RazlogPrisustva { get; set; } = null!;
        public string? Napomena { get; set; }
        public int? StatusId { get; set; }
        public string BrojNeuslovneRobe { get; set; } = null!;

        public virtual Artikal Artikal { get; set; } = null!;
        public virtual Prodavnica Prodavnica { get; set; } = null!;
        public virtual Status? Status { get; set; }
    }
}
