using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Inventura
    {
        public int Id { get; set; }
        public string? Broj { get; set; }
        public DateTime Datum { get; set; }
        public decimal InventurnaVrijednost { get; set; }
        public decimal KnjigovodstvenaVrijednost { get; set; }
        public int Kategorija { get; set; }
        public int Podkategorija { get; set; }
        public int ProdavnicaId { get; set; }
        public DateTime DatumUnosa { get; set; }

        public virtual Prodavnica Prodavnica { get; set; } = null!;
    }
}
