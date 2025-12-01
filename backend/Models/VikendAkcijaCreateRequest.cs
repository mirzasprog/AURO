using System;

namespace backend.Models
{
    public class VikendAkcijaCreateRequest
    {
        public string? Opis { get; set; }

        public DateTime Pocetak { get; set; }

        public DateTime Kraj { get; set; }
    }
}
