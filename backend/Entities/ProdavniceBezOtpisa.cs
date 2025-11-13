using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class ProdavniceBezOtpisa
    {
        public DateTime DatumUnosa { get; set; }
        public string BrojProdavnice { get; set; } = null!;
    }
}
