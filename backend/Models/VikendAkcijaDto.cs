using System;

namespace backend.Models
{
    public class VikendAkcijaDto
    {
        public int Id { get; set; }
        public string? Opis { get; set; }
        public DateTime Pocetak { get; set; }
        public DateTime Kraj { get; set; }
        public string? Status { get; set; }
        public int BrojStavki { get; set; }
    }
}
