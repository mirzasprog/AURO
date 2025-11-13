namespace backend.Models {
    public class UnesenaNeuslovnaRoba {
        public string? SifraArtikla { get; set; }
        public string? Napomena { get; set; }
        public string? Naziv { get; set; }
        public string? RazlogNeuslovnosti { get; set; }
        public string? OtpisPovrat { get; set; }
        public string? RazlogPrisustva { get; set; }
        public string? JedinicaMjere { get; set; }
        public decimal Kolicina { get; set; }
        public decimal NabavnaVrijednost { get; set; }
        public decimal UkupnaVrijednost { get; set; }
        
    }
}