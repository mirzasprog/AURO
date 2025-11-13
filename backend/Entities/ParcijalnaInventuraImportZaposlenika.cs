using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public partial class ParcijalnaInventuraImportZaposlenika
    {
        public int Id { get; set; }
        public int BrojIzMaticneKnjige { get; set; }

        [StringLength(50)]
        public string Ime { get; set; } = null!;

        [StringLength(150)]
        public string Prezime { get; set; } = null!;

        [StringLength(150)]
        public string RadnoMjesto { get; set; } = null!;

        [StringLength(25)]
        public string? OznakaOJ { get; set; } = null!;

        [StringLength(25)]
        public string? NazivOJ { get; set; }

        [StringLength(25)]
        public string Entitet { get; set; } = null!;

        [StringLength(25)]
        public string Format { get; set; } = null!;
        public DateTime DatumUcitavanja { get; set; }

        [StringLength(150)]
        public string PodrucniVoditelj { get; set; } = null!;

        [StringLength(20)]
        public string Tip { get; set; } = null!;

//        public float? IznosZaIsplatu { get; set; }
//        public int? BrojSati { get; set; }
//        public int? BrojDana { get; set; }
    }
}
