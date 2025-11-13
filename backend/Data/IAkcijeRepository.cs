using backend.Models;

namespace backend.Data {
    public interface IAkcijeRepository
    {
        IEnumerable<AkcijeZaglavljeResponse> PreuzmiAkcijeZaglavlje();
        IEnumerable<AkcijeStavkeResponse> PreuzmiAkcijeStavke(int akcijaID);
    }
}