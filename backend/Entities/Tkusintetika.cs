using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Tkusintetika
    {
        public string Komitent { get; set; } = null!;
        public string Prodavnica { get; set; } = null!;
        public DateTime Datum { get; set; }
        public int? Rbr { get; set; }
        public string? Opis { get; set; }
        public string? Iznosnaknadesapdv { get; set; }
    }
}
