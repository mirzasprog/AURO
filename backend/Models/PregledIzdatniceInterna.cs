using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class PregledIzdatnicaInterna
    {
        public string BrojIzdatnice { get; set; } = null!;
        public string prodavnica { get; set; } = null!;
        public string DatumPopunjavanja { get; set; }= null!;
    }
}
