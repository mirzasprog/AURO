using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class DatumOdobravanjaInventure
    {
        public int Id { get; set; }
        public DateTime DatumOd { get; set; }
        public DateTime DatumDo { get; set; }
    }
}
