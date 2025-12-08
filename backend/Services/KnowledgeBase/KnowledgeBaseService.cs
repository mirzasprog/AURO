using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using backend.Services.OpenAi;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.KnowledgeBase
{
    public class KnowledgeBaseService
    {
        private readonly Auro2Context _dbContext;
        private readonly OpenAiEmbeddingService _embeddingService;
        private readonly ILogger<KnowledgeBaseService> _logger;

        public KnowledgeBaseService(Auro2Context dbContext, OpenAiEmbeddingService embeddingService, ILogger<KnowledgeBaseService> logger)
        {
            _dbContext = dbContext;
            _embeddingService = embeddingService;
            _logger = logger;
        }

        public async Task AddDocumentAsync(string title, string content, CancellationToken ct = default)
        {
            var embedding = await _embeddingService.EmbedAsync(content, ct);

            var entity = new KnowledgeBaseDocument
            {
                Title = title,
                Content = content,
                Embedding = embedding,
                CreatedAt = DateTime.UtcNow,
            };

            await _dbContext.KnowledgeBaseDocuments.AddAsync(entity, ct);
            await _dbContext.SaveChangesAsync(ct);

            _logger.LogInformation("Stored knowledge document {Title} with id {Id}", title, entity.Id);
        }

        public async Task<List<KnowledgeBaseDocument>> SearchAsync(string query, int topN, CancellationToken ct = default)
        {
            var queryEmbedding = await _embeddingService.EmbedAsync(query, ct);
            var documents = await _dbContext.KnowledgeBaseDocuments.AsNoTracking().ToListAsync(ct);

            var ranked = documents
                .Select(doc => new
                {
                    Document = doc,
                    Score = CosineSimilarity.Calculate(queryEmbedding, doc.Embedding),
                })
                .OrderByDescending(x => x.Score)
                .Take(topN)
                .Where(x => x.Score > 0)
                .Select(x => x.Document)
                .ToList();

            return ranked;
        }

        public static string BuildContextBlock(IEnumerable<KnowledgeBaseDocument> documents)
        {
            var sb = new StringBuilder();
            var index = 1;
            foreach (var doc in documents)
            {
                sb.AppendLine($"[DOC {index}] {doc.Title}");
                sb.AppendLine(doc.Content);
                sb.AppendLine();
                index++;
            }

            return sb.ToString();
        }
    }
}
