namespace backend.Data {
    public interface IPrometiRepository
    {
        PrometiDto? PreuzmiPromete(string prodavnica);
    }
}