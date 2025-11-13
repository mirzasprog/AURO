using backend.Models;

namespace backend.Data {
    public interface IPDTlistaRepository {
        public IEnumerable<PDTdokumenti> PreuzmiPDTdokumente();
        public IEnumerable<PDTartikliVanrednogOtpisa> PreuzmiPDTartikleVanredniOtpis(UnosPDTvanredni podaci);
        public IEnumerable<PDTartikliRedovnogOtpisa> PreuzmiPDTartikleRedovniOtpis(UnosPDTredovni podaci);
        public IEnumerable<PDTIzdatnicaTroska> PreuzmiPDTartikleIzdatnice(UnosPDTIzdatnice podaci);
         public IEnumerable<PDTNeuslovnaRoba> PreuzmiPDTartikleNeuslovneRobe(UnosPDTNeuslovneRobe podaci);
    }
}