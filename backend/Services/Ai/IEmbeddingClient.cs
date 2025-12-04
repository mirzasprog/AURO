using System.Threading;
using System.Threading.Tasks;

namespace backend.Services.Ai
{
    public interface IEmbeddingClient
    {
        Task<float[]> GetEmbeddingAsync(string text, CancellationToken ct = default);
    }
}
