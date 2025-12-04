using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Services.Knowledge
{
    public class ImageTextExtractor : ITextExtractor
    {
        public bool CanExtract(string fileExtension, string contentType)
        {
            return contentType.StartsWith("image/") ||
                   fileExtension.Equals(".png", System.StringComparison.OrdinalIgnoreCase) ||
                   fileExtension.Equals(".jpg", System.StringComparison.OrdinalIgnoreCase) ||
                   fileExtension.Equals(".jpeg", System.StringComparison.OrdinalIgnoreCase);
        }

        public Task<string> ExtractTextAsync(Stream fileStream, CancellationToken ct = default)
        {
            // TODO: Integrate OCR service (e.g., Tesseract/Azure) to extract text from images.
            return Task.FromResult(string.Empty);
        }
    }
}
