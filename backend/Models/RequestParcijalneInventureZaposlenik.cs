using System.ComponentModel.DataAnnotations;
namespace backend.Models
{
    public class RequestParcijalneInventureZaposlenik
    {
        public decimal IznosZaIsplatu { get; set; }
        public int BrojSati { get; set; }
        public int BrojDana { get; set; }
        public int BrojMinuta { get; set; }

        [StringLength(25)]
        public string Ime { get; set; } = null!;

        [StringLength(50)]
        public string Prezime { get; set; } = null!;

        [StringLength(25)]
        public string OrgJedUposlenika { get; set; } = null!;

        public int BrojIzDESa { get; set; }

        public string VrstaInventure { get; set; } = null!;

        public string RolaNaInventuri { get; set; } = null!;
    }
}