using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class UneseniUcesniciInventure {
        public DateTime DatumIzrade { get; set; }
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string? BrojProdavniceUcesnika {get; set;}
        public DateTime VrijemePocetka {get; set;}
        public DateTime VrijemeZavrsetka {get; set;}
        public string? RolaNaInventuri {get; set;}
    }
}