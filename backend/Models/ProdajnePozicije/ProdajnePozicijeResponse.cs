using System.Collections.Generic;

namespace backend.Models.ProdajnePozicije
{
    public class ProdajnePozicijeResponse
    {
        public ProdajniLayoutDto? Layout { get; set; }
        public List<ProdajnaPozicijaDto> Pozicije { get; set; } = new();
    }
}
