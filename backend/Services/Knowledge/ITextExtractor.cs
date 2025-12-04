using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Services.Knowledge
{
    public interface ITextExtractor
    {
        bool CanExtract(string fileExtension, string contentType);

        Task<string> ExtractTextAsync(Stream fileStream, CancellationToken ct = default);
    }
}
