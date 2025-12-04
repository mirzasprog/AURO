using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace backend.Services.VectorStore
{
    public class PgVectorStore : IVectorStore
    {
        private readonly ILogger<PgVectorStore> _logger;
        private readonly VectorStoreOptions _options;

        public PgVectorStore(IOptions<VectorStoreOptions> options, ILogger<PgVectorStore> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public Task StoreAsync(IEnumerable<VectorRecord> records, CancellationToken ct = default)
        {
            var recordCount = records.Count();
            _logger.LogInformation("Storing {Count} vector records to pgvector at {Host}:{Port}", recordCount, _options.Host, _options.Port);
            return Task.CompletedTask;
        }

        public Task<IReadOnlyList<VectorRecord>> SearchAsync(string query, int topK, IReadOnlyDictionary<string, string>? filters = null, CancellationToken ct = default)
        {
            _logger.LogInformation("Performing vector search for '{Query}' (top {TopK}) using pgvector at {Host}:{Port}", query, topK, _options.Host, _options.Port);
            return Task.FromResult<IReadOnlyList<VectorRecord>>(new List<VectorRecord>());
        }
    }
}
