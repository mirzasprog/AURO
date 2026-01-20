using backend.Models;
using backend.Models.VIP;

namespace backend.Data
{
    public interface IVikendAkcijeRepository
    {
        Task<IEnumerable<VikendAkcijaDto>> GetAkcijeAsync();
        Task<IEnumerable<VikendAkcijaStavkaDto>> GetStavkeAsync(string vikendAkcijaId);
        Task<VikendAkcijaStavkeUpdateResult> UpdateStavkeAsync(string vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene);
        Task<IEnumerable<VipArtikalDto>> GetVipArtikliAsync(string akcijaId);
        Task<VikendAkcijaDto> KreirajAkcijuAsync(VikendAkcijaCreateRequest zahtjev);
        Task<VikendAkcijaImportResult> ImportArtikalaAsync(string akcijaId, IFormFile file);
        Task<VikendAkcijaProduzenjeResult> ProduziAkcijuAsync(string vikendAkcijaId, int brojSati);
        Task<IEnumerable<NaruceniArtikalAkcijeResponse>> GetNaruceniArtikliSaAkcijeAsync(string idAkcije);
    }
}
