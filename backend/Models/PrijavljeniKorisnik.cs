using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PrijavljeniKorisnik
    {
        [Required]
        public string KorisnickoIme { get; set; } = null!; // This indicate that this property will have value eventually. so no warning generate during compilation.

        [Required]
        public string Lozinka { get; set; } = null!;
    }
}
