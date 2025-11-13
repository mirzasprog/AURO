using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class RequestParcijalneInventure
    {
        public string DatumInventure { get; set; } = null!;

        [StringLength(25)]
        public string OrgJed { get; set; } = null!;       
        
        [StringLength(25)]
        public string BrojProdavnice { get; set; } = null!;

        [StringLength(150)]
        public string Pv { get; set; } = null!;

        [StringLength(50)]
        public string Status { get; set; } = null!;       
        
        [StringLength(50)]
        public string BrojDokumenta { get; set; } = null!;

        public IEnumerable<RequestParcijalneInventureZaposlenik> Podaci {get; set; } = null!;

    }
}
