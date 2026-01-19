using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class VipZaglavlje
    {
        public VipZaglavlje()
        {
            VipStavkes = new HashSet<VipStavke>();
        }

        public int Id { get; set; }
        public string? Opis { get; set; }
        public DateTime Pocetak { get; set; }
        public DateTime Kraj { get; set; }
        public string? Status { get; set; }
        public string? UniqueId { get; set; }
        public bool Produzeno { get; set; }

        public virtual ICollection<VipStavke> VipStavkes { get; set; }
    }
}
