using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Dobavljac
    {
        public Dobavljac()
        {
            Artikals = new HashSet<Artikal>();
        }

        public int DobavljacId { get; set; }
        public string? Naziv { get; set; }
        public string? Sifra { get; set; }
        public string? Aktivnost { get; set; }
        public string? Adresa { get; set; }
        public string? Grad { get; set; }
        public string? Drzava { get; set; }
        public string? KontaktNaziv { get; set; }
        public string? Kontakt { get; set; }

        public virtual ICollection<Artikal> Artikals { get; set; }
    }
}
