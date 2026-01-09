using backend.Models;

namespace backend.Repositories
{
    public interface INarucenoIsporucenoRepository
    {
        Task<IEnumerable<NarucenoIsporucenoResponse>> GetAllAsync();
        Task<NarucenoIsporucenoResponse?> GetByNarudzbaAsync(string narudzba);
        Task<IEnumerable<NarucenoIsporucenoResponse>> GetByProdavnicaAsync(string prodavnica);
        Task<IEnumerable<NarucenoIsporucenoResponse>> GetByDobavljacAsync(string sifraDobavljaca);
        Task<IEnumerable<NarucenoIsporucenoResponse>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate);
    }
}