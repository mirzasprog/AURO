using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class UnosUcesnikaInventure
    {
        public DateTime DatumIzrade { get; set; }
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public string BrojProdavniceUcesnika { get; set; } = null!;
        public DateTime VrijemePocetka { get; set; } 
        public DateTime VrijemeZavrsetka { get; set; }
        public string RolaNaInventuri { get; set; } = null!;
        //  public string BrojProdavnice {get; set;} = null!;
    }
}