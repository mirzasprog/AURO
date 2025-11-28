using backend.Models;

namespace backend.Data
{
    public interface IVikendAkcijeRepository
    {
        Task<IEnumerable<VikendAkcijaDto>> GetAkcijeAsync();
        Task<IEnumerable<VikendAkcijaStavkaDto>> GetStavkeAsync(int vikendAkcijaId);
        Task UpdateStavkeAsync(int vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene);
    }
}
