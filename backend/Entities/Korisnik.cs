using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Korisnik
    {
        public Korisnik()
        {
            Otpis = new HashSet<Otpis>();
        }

        public int KorisnikId { get; set; }
        public string KorisnickoIme { get; set; } = null!;
        public string? Lozinka { get; set; }
        public string Email { get; set; } = null!;
        public string Uloga { get; set; } = null!;
        public bool Aktivan { get; set; }

        public virtual Menadzer Menadzer { get; set; } = null!;
        public virtual Prodavnica Prodavnica { get; set; } = null!;
        public virtual ICollection<Otpis> Otpis { get; set; }
    }
}
