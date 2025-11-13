namespace backend.Models {
    public class UneseniRedovniOtpis {
      //  public int RedniBroj { get; set; }
        public string? Sifra { get; set; }
        public string? Naziv { get; set; }
        public string? ProvedenoSnizenje { get; set; }
        public string? Razlog { get; set; }
        public string? JedinicaMjere { get; set; }
        public decimal Kolicina { get; set; }
        public decimal NabavnaVrijednost { get; set; }
        public decimal UkupnaVrijednost { get; set; }
        public DateTime? DatumIstekaRoka { get; set; } = null;
        
    }
}