using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Tkuanalitika
    {
        public int Id { get; set; }
        public string? Prodavnica { get; set; }
        public DateTime? Datum { get; set; }
        public string? Distributer { get; set; }
        public int? Brojtransakcija { get; set; }
        public decimal? Prodajabezpdv { get; set; }
        public decimal? Pdv { get; set; }
        public decimal? Prodajasapdv { get; set; }
        public decimal? Provizija { get; set; }
        public decimal? Poreznaproviziju { get; set; }
        public decimal? Ukupnosapdv { get; set; }
    }
}
