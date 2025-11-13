using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class PregledNeuslovneRobe
    {
        public string prodavnica { get; set; } = null!;
        public string DatumPopunjavanja { get; set; }= null!;
        public string BrojNeuslovneRobe { get; set; }= null!;
    }
}
