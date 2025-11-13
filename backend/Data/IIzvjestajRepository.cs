using backend.Models;

namespace backend.Data {
    public interface IIzvjestajRepository {
        public Tuple<IEnumerable<IzvjestajTrgovackaKnjigaSintetika>?, decimal, decimal, decimal> PreuzmiIzvjestajTrgovackaKnjigaSintetika(DateTime datumOd, DateTime datumDo);
        public IEnumerable<IzvjestajTrgovackaKnjigaAnalitika> PreuzmiIzvjestajTrgovackaKnjigaAnalitika(DateTime datumOd, DateTime datumDo);
        public IEnumerable<IzvjestajIzdatnica> PreuzmiIzvjestajIzdatnica(DateTime datumOd, DateTime datumDo);
    }
}