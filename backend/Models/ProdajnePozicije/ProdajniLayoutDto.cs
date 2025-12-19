namespace backend.Models.ProdajnePozicije
{
    public class ProdajniLayoutDto
    {
        public int Id { get; set; }
        public int ProdavnicaId { get; set; }
        public decimal Sirina { get; set; }
        public decimal Duzina { get; set; }
    }
}
