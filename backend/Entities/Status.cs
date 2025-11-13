using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Status
    {
        public Status()
        {
            ArtikalOvjeraOtpisas = new HashSet<ArtikalOvjeraOtpisa>();
            NeuslovnaRobas = new HashSet<NeuslovnaRoba>();
        }

        public int Id { get; set; }
        public string Naziv { get; set; } = null!;

        public virtual ICollection<ArtikalOvjeraOtpisa> ArtikalOvjeraOtpisas { get; set; }
        public virtual ICollection<NeuslovnaRoba> NeuslovnaRobas { get; set; }
    }
}
