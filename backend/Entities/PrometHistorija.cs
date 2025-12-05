using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class PrometHistorija
    {
        [Key]
        public int PrometId { get; set; }
        public string? BrojProdavnice { get; set; }
        public DateTime Datum { get; set; }
        public int Godina { get; set; }
        public int Mjesec { get; set; }
        public int Dan { get; set; }
        public decimal UkupniPromet { get; set; }
        public int? BrojKupaca { get; set; }
        public DateTime DatumUnosa { get; set; }
    }
}
