using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ClosedXML.Excel;

namespace backend.Services.Knowledge
{
    public class ExcelTextExtractor : ITextExtractor
    {
        public bool CanExtract(string fileExtension, string contentType)
        {
            return fileExtension.Equals(".xlsx", System.StringComparison.OrdinalIgnoreCase) ||
                   contentType.Equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", System.StringComparison.OrdinalIgnoreCase);
        }

        public Task<string> ExtractTextAsync(Stream fileStream, CancellationToken ct = default)
        {
            var builder = new StringBuilder();

            using var workbook = new XLWorkbook(fileStream);
            foreach (var worksheet in workbook.Worksheets)
            {
                foreach (var row in worksheet.RowsUsed())
                {
                    foreach (var cell in row.CellsUsed())
                    {
                        if (ct.IsCancellationRequested)
                        {
                            ct.ThrowIfCancellationRequested();
                        }

                        var cellValue = cell.GetString();
                        if (!string.IsNullOrWhiteSpace(cellValue))
                        {
                            builder.Append(cellValue);
                            builder.Append(' ');
                        }
                    }

                    builder.AppendLine();
                }

                builder.AppendLine();
            }

            return Task.FromResult(builder.ToString());
        }
    }
}
