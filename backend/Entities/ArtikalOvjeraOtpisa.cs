using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class ArtikalOvjeraOtpisa
    {
        public int Id { get; set; }
        public int MenadzerId { get; set; }
        public int ProdavnicaId { get; set; }
        public int? StatusId { get; set; }
        public DateTime? DatumOvjere { get; set; }
        public string? Komentar { get; set; }
        public int? OtpisId { get; set; }

        public virtual Menadzer Menadzer { get; set; } = null!;
        public virtual Otpis? Otpis { get; set; }
        public virtual Prodavnica Prodavnica { get; set; } = null!;
        public virtual Status? Status { get; set; }
    }
}
