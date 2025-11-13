using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Prodavnica
    {
        public Prodavnica()
        {
            ArtikalOvjeraOtpisas = new HashSet<ArtikalOvjeraOtpisa>();
            HijerarhijaOdobravanjas = new HashSet<HijerarhijaOdobravanja>();
            Inventuras = new HashSet<Inventura>();
            Izdatnicas = new HashSet<Izdatnica>();
            NeuslovnaRobas = new HashSet<NeuslovnaRoba>();
        }

        public int KorisnikId { get; set; }
        public string BrojProdavnice { get; set; } = null!;
        public string NazivCjenika { get; set; } = null!;
        public string Mjesto { get; set; } = null!;
        public int? MenadzerId { get; set; }

        public virtual Korisnik Korisnik { get; set; } = null!;
        public virtual ICollection<ArtikalOvjeraOtpisa> ArtikalOvjeraOtpisas { get; set; }
        public virtual ICollection<HijerarhijaOdobravanja> HijerarhijaOdobravanjas { get; set; }
        public virtual ICollection<Inventura> Inventuras { get; set; }
        public virtual ICollection<Izdatnica> Izdatnicas { get; set; }
        public virtual ICollection<NeuslovnaRoba> NeuslovnaRobas { get; set; }
    }
}
