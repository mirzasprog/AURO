using backend.Models;
using Microsoft.AspNetCore.Http;

namespace backend.Data
{
    public interface IVikendAkcijeRepository
    {
        Task<IEnumerable<VikendAkcijaDto>> GetAkcijeAsync();
        Task<IEnumerable<VikendAkcijaStavkaDto>> GetStavkeAsync(int vikendAkcijaId);
        Task UpdateStavkeAsync(int vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene);
        Task<VikendAkcijaDto> KreirajAkcijuAsync(VikendAkcijaCreateRequest zahtjev);
        Task<VikendAkcijaImportResult> ImportArtikalaAsync(string akcijaId, IFormFile file);
    }
}
