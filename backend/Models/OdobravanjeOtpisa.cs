//using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class OdobravanjeOtpisa 
    {
        public string? BrojOtpisa { get; set; } = null;
        public string? Komentar { get; set; } = null;
        public string? SifraArtikla { get; set; } = null;
        public short? Status { get; set; } = null;
        //public string? SifraArtikla { get; set; } = null;
        //public int[]? Artikli { get; set; } = null;

    }
}