using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class DetaljiArtiklaReklamacija {

        public string Sifra { get; set; } = null!;
        public string Naziv { get; set; } = null!;
        public string JedinicaMjere { get; set; } = null!;

    }
}
