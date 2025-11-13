namespace backend.Models
{
    public class PregledIzdatnica
    {
        public string BrojIzdatnice { get; set; } = null!;
        public string Razlog { get; set; } = null!;
        public string prodavnica { get; set; } = null!;
        public string DatumPopunjavanja { get; set; }= null!;
        public string Status { get; set; } = null!;
    }
}
