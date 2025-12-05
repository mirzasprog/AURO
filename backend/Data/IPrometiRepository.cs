using backend.Models;

namespace backend.Data {
    public interface IPrometiRepository
    {
        ResponsePrometProdavnice? PreuzmiPrometProdavnice(string prodavnica);
        ResponsePrometiProdavnica? PreuzmiPrometeSvihProdavnica();
        List<ResponsePrometiProdavnica>? PreuzmiSvePromete();
        List<PrometHistoryComparison> PreuzmiPrometDetaljeZaMjesec();
    }
}