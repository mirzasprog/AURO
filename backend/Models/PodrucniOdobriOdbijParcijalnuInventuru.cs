namespace backend.Models
{
    public class PodrucniOdobriOdbijeParcijalnuInventuru 
    {
        public string BrojProd { get; set; } = null!;
        public string Datum { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string BrojDokumenta { get; set; } = null!;
        public string? Napomena { get; set; } = null;
    
    }
}