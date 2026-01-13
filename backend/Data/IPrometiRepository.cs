using backend.Models;
using backend.Models.Prometi;

namespace backend.Data {
    public interface IPrometiRepository
    {
        ResponsePrometProdavnice? PreuzmiPrometProdavnice(string prodavnica);
        ResponsePrometiProdavnica? PreuzmiPrometeSvihProdavnica();
        List<ResponsePrometiProdavnica>? PreuzmiSvePromete();
        List<PrometHistoryComparison> PreuzmiPrometDetaljeZaMjesec();
        PrometRangeResponse PreuzmiPrometePoOpsegu(DateTime currentStart, DateTime currentEnd, DateTime previousStart, DateTime previousEnd);
        Task<IEnumerable<KategorijaPrometResponse>> GetPrometCijeleMrezePoKategorijiAsync();
         Task<IEnumerable<KategorijaPrometResponse>> GetPrometProdavnicePoKategorijiAsync(string brojProdavnice);
        Task<IEnumerable<ArtikliNaRacunuResponse>> GetArtikliNaRacunuPoKategorijiAsync(string brojProdavnice, string kategorija);
    }
}
