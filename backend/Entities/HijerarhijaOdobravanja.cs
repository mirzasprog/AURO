using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class HijerarhijaOdobravanja
    {
        public int MenadzerId { get; set; }
        public int ProdavnicaId { get; set; }
        public int RedniBroj { get; set; }

        public virtual Menadzer Menadzer { get; set; } = null!;
        public virtual Prodavnica Prodavnica { get; set; } = null!;
    }
}
