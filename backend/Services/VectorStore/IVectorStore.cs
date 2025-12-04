using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Services.VectorStore
{
    public interface IVectorStore
    {
        Task StoreAsync(IEnumerable<VectorRecord> records, CancellationToken ct = default);

        Task<IReadOnlyList<VectorRecord>> SearchAsync(string query, int topK, IReadOnlyDictionary<string, string>? filters = null, CancellationToken ct = default);
    }
}
