namespace backend.Models {
    public class IzvjestajParcijalnaInventuraInternaKontrola {
        public string OznakaOJ { get; set; } = null!;
        public string  NazivOj { get; set; } = null!;
        public string Format { get; set; } = null!;
        public string Entitet { get; set; } = null!;
        public int BrojIzDesa { get; set; }
        public string Prezime { get; set; } = null!;
        public string Ime { get; set; } = null!;
        public int NaknadaPoZaposleniku { get; set; } = 10;
        public int BrojDana { get; set; }
        public int BrojSati { get; set; }
        public string DatumInventure { get; set; } = null!;
        public decimal? IznosZaIsplatu { get; set; }
        public string PodrucniVoditelj { get; set; } = null!;
        public string VrstaInventure { get; set; } = null!;
        public string RolaNaInventuri { get; set; } = null!;

    }
}