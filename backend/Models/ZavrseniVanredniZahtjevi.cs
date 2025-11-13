using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class ZavrseniVanredniZahtjevi {
       // public string BrojOtpisa { get; set; } = null!;
        public string BrojOtpisa { get; set; } = null!;
        public string Prodavnica { get; set; } = null!;
        public string DatumPopunjavanja { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}