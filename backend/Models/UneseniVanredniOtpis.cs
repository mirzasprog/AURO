namespace backend.Models {
    public class UneseniVanredniOtpis {
        public string? Sifra { get; set; }
        public string? Naziv { get; set; }
        public string? Razlog { get; set; }
        public string? PotrebnoZbrinjavanje { get; set; }
        public string? PotrebanTransport { get; set; }
        public string? JedinicaMjere { get; set; }
        public decimal Kolicina { get; set; }
        public decimal NabavnaVrijednost { get; set; }
        public decimal UkupnaVrijednost { get; set; }
        public string? Komentar {get; set;}  
    }
}