using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ResponseZaposleniciParcijalneInventure
    {

        public int BrojIzDESa { get; set; }

        [StringLength(50)]
        public string Ime { get; set; } = null!;

        [StringLength(150)]
        public string Prezime { get; set; } = null!;

        [StringLength(150)]
        public string Pv {get; set;} = null!;

        [StringLength(25)]
        public string OrgJed { get; set; } = null!;
        
        [StringLength(25)]
        public string NazivOrg { get; set; } = null!;

        [StringLength(25)]
        public string Entitet { get; set; } = null!;

        [StringLength(10)]
        public string Format { get; set; } = null!;
    }
}
