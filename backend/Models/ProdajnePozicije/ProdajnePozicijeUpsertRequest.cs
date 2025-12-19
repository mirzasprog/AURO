using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.ProdajnePozicije
{
    public class ProdajnePozicijeUpsertRequest
    {
        [Range(0.1, double.MaxValue)]
        public decimal Sirina { get; set; }

        [Range(0.1, double.MaxValue)]
        public decimal Duzina { get; set; }

        public List<ProdajnaPozicijaDto> Pozicije { get; set; } = new();
    }
}
