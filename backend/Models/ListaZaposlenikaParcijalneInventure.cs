using System.ComponentModel.DataAnnotations;

namespace backend.Models {
    public class ListaZaposlenikaParcijalneInventure {
        public string BrojIzDESa { get; set; } = null!;

        [StringLength(50)]
        public string Ime { get; set; } = null!;

        [StringLength(150)]
        public string Prezime { get; set; } = null!;

        [StringLength(150)]
        public string Rm { get; set; } = null!;

        [StringLength(25)]
        public string OrgJed { get; set; } = null!;

        [StringLength(25)]
        public string NazivOrg { get; set; } = null!;

        [StringLength(25)]
        public string Entitet { get; set; } = null!;

        public string Format { get; set; } = null!;
        public DateTime DatumUcitavanja { get; set; }

        [StringLength(150)]
        public string PV { get; set; } = null!;

        [StringLength(20)]
        public string Tip { get; set; } = null!;
        
    }
}