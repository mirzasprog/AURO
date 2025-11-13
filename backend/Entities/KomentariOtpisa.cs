using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class KomentariOtpisa
    {
        public int Id { get; set; }
        public string BrojOtpisa { get; set; } = null!;
        public int MenadzerId { get; set; }
        public int ProdavnicaId { get; set; }
        public string? Komentar { get; set; }
    }
}
