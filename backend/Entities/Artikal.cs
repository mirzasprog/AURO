using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Artikal
    {
        public Artikal()
        {
            Izdatnicas = new HashSet<Izdatnica>();
            NeuslovnaRobas = new HashSet<NeuslovnaRoba>();
            Otpis = new HashSet<Otpis>();
        }

        public int ArtikalId { get; set; }
        public string? Barkod { get; set; }
        public string Naziv { get; set; } = null!;
        public string? JedinicaMjere { get; set; }
        public int? KategorijaId { get; set; }
        public int? PodkategorijaId { get; set; }
        public string? Sifra { get; set; }
        public string? Aktivnost { get; set; }
        public int? DobavljacId { get; set; }
        public decimal? Kal { get; set; }
        public decimal? Sa0 { get; set; }
        public decimal? Mo0 { get; set; }
        public decimal? Sa4 { get; set; }
        public decimal? Bl0 { get; set; }
        public decimal? Tz0 { get; set; }
        public decimal? Zh0 { get; set; }
        public decimal? Zc1 { get; set; }
        public decimal? Zc6 { get; set; }
        public decimal? Merc { get; set; }
        public decimal? Vel { get; set; }
        public decimal Cijena { get; set; }
        public decimal NabavnaCijena { get; set; }

        public virtual Dobavljac? Dobavljac { get; set; }
        public virtual ICollection<Izdatnica> Izdatnicas { get; set; }
        public virtual ICollection<NeuslovnaRoba> NeuslovnaRobas { get; set; }
        public virtual ICollection<Otpis> Otpis { get; set; }
    }
}
