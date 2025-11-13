using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Podkategorija
    {
        public int Id { get; set; }
        public string Naziv { get; set; } = null!;
    }
}
