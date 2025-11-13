using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public partial class ParcijalnaInventura
    {
        public int Id { get; set; }
        public decimal IznosZaIsplatu { get; set; }
        public int BrojSati { get; set; }
        public int BrojMinuta { get; set; }
        public int BrojDana { get; set; }
        public string DatumInventure { get; set; } = null!;
        public string BrojDokumenta { get; set; } = null!;

        [StringLength(150)]
        public string PodrucniVoditelj {get; set;} = null!;

        [StringLength(25)]
        public string OrgJed { get; set; } = null!;        
        
        [StringLength(25)]
        public string BrojProdavnice { get; set; } = null!;

        [StringLength(25)]
        public string Ime { get; set; } = null!;

        [StringLength(50)]
        public string Prezime { get; set; } = null!;

        public int BrojIzDESa { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = null!;

        [StringLength(500)]
        public string? Napomena { get; set; } = null;

        public string VrstaInventure { get; set; } = null!;
        public string RolaNaInventuri { get; set; } = null!;
    }
}
