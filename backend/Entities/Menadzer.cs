using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Menadzer
    {
        public Menadzer()
        {
            ArtikalOvjeraOtpisas = new HashSet<ArtikalOvjeraOtpisa>();
            HijerarhijaOdobravanjas = new HashSet<HijerarhijaOdobravanja>();
        }

        public int KorisnikId { get; set; }
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public string NazivRadnogMjesta { get; set; } = null!;

        public virtual Korisnik Korisnik { get; set; } = null!;
        public virtual ICollection<ArtikalOvjeraOtpisa> ArtikalOvjeraOtpisas { get; set; }
        public virtual ICollection<HijerarhijaOdobravanja> HijerarhijaOdobravanjas { get; set; }
    }
}
