using backend.Models;

namespace backend.Data {
    public interface IKontrolneInventureRepository {
        public IEnumerable<KontrolneInventure> PreuzmiKontrolneInventure();
    }
}