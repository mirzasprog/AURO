namespace backend.Models {
    public class PregledUcesnika {
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public DateTime Datum { get; set; }
        public string BrojProdavnice {get; set;} = null!;
        public string BrojProdavniceUcesnika {get; set;} = null!;
        public DateTime VrijemePocetka {get; set;}  
        public DateTime VrijemeZavrsetka {get; set;}  
        public string RolaNaInventuri {get; set;} =  null!;

    }
}
