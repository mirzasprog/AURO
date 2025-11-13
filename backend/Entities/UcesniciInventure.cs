using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class UcesniciInventure
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public DateTime Datum { get; set; }
        public string? BrojProdavnice { get; set; } = null!;
        public string? BrojProdavniceUcesnika { get; set; }
        public DateTime VrijemePocetka { get; set; }
        public DateTime VrijemeZavrsetka { get; set; }
        public string RolaNaInventuri { get; set; } = null!;
    }
}
