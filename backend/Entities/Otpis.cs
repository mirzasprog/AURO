using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class Otpis
    {
        public Otpis()
        {
            ArtikalOvjeraOtpisas = new HashSet<ArtikalOvjeraOtpisa>();
        }

        public int Id { get; set; }
        public DateTime? DatumKreiranja { get; set; }
        public string BrojOtpisa { get; set; } = null!;
        public int TipOtpisaId { get; set; }
        public int ArtikalId { get; set; }
        public int PodnosiocId { get; set; }
        public string RazlogOtpisa { get; set; } = null!;
        public string? Napomena { get; set; }
        public string? PotrebnoZbrinjavanje { get; set; }
        public string? PotrebanTransport { get; set; }
        public string? ProvedenoSnizenje { get; set; }
        public string? KomentarVanrednogOtpisa { get; set; }
        public decimal Kolicina { get; set; }
        public decimal UkupnaVrijednost { get; set; }
        public DateTime? DatumIstekaRoka { get; set; }

        public virtual Artikal Artikal { get; set; } = null!;
        public virtual Korisnik Podnosioc { get; set; } = null!;
        public virtual TipOtpisa TipOtpisa { get; set; } = null!;
        public virtual ICollection<ArtikalOvjeraOtpisa> ArtikalOvjeraOtpisas { get; set; }
    }
}
