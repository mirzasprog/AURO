using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UglyToad.PdfPig;

namespace backend.Services.Knowledge
{
    public class PdfTextExtractor : ITextExtractor
    {
        public bool CanExtract(string fileExtension, string contentType)
        {
            return fileExtension.Equals(".pdf", System.StringComparison.OrdinalIgnoreCase) ||
                   contentType.Equals("application/pdf", System.StringComparison.OrdinalIgnoreCase);
        }

        public Task<string> ExtractTextAsync(Stream fileStream, CancellationToken ct = default)
        {
            var builder = new StringBuilder();

            using var document = PdfDocument.Open(fileStream);
            foreach (var page in document.GetPages())
            {
                if (ct.IsCancellationRequested)
                {
                    ct.ThrowIfCancellationRequested();
                }

                builder.AppendLine(page.Text);
            }

            return Task.FromResult(builder.ToString());
        }
    }
}
