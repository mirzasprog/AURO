using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class GetPodaciReklamacije 
    {
        public string? Razlog { get; set; } 
        public DateTime Datum { get; set; }
        public DateTime DatumPrijema { get; set; }
        public string? JedinicaMjere {get; set;}
        public string? Komentar {get; set;}
        public string? SifraArtikla { get; set; }
        public string? Naziv { get; set; }
        public string? BrojProdavnice { get; set; }
        public int Kolicina { get; set; }
        public string? BrojDokumenta { get; set; }
        public int ReklamiranaKolicina { get; set; }
        public string? Lot { get; set; }
        public string? BrojZaduzenjaMLP { get; set; }
        
    }
}