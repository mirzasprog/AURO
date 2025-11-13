using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class TipOtpisa
    {
        public TipOtpisa()
        {
            Otpis = new HashSet<Otpis>();
        }

        public int Id { get; set; }
        public string TipOtpisa1 { get; set; } = null!;

        public virtual ICollection<Otpis> Otpis { get; set; }
    }
}
