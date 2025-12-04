using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using backend.Models;
using backend.Services.Ai;
using backend.Services.VectorStore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace backend.Services.Knowledge
{
    public class DocumentImportService
    {
        private readonly IEnumerable<ITextExtractor> _textExtractors;
        private readonly IEmbeddingClient _embeddingClient;
        private readonly IVectorStore _vectorStore;
        private readonly Auro2Context _dbContext;
        private readonly DocumentImportOptions _options;
        private readonly ILogger<DocumentImportService> _logger;

        public DocumentImportService(
            IEnumerable<ITextExtractor> textExtractors,
            IEmbeddingClient embeddingClient,
            IVectorStore vectorStore,
            Auro2Context dbContext,
            IOptions<DocumentImportOptions> options,
            ILogger<DocumentImportService> logger)
        {
            _textExtractors = textExtractors;
            _embeddingClient = embeddingClient;
            _vectorStore = vectorStore;
            _dbContext = dbContext;
            _options = options.Value;
            _logger = logger;
        }

        public async Task<KnowledgeDocument> ImportAsync(DocumentImportRequest request, CancellationToken ct = default)
        {
            if (request.File == null || request.File.Length == 0)
            {
                throw new InvalidOperationException("File is required for import.");
            }

            var fileExtension = Path.GetExtension(request.File.FileName);
            var extractor = _textExtractors.FirstOrDefault(ex => ex.CanExtract(fileExtension, request.File.ContentType));

            if (extractor == null)
            {
                throw new InvalidOperationException($"Unsupported file type: {fileExtension}");
            }

            var document = new KnowledgeDocument
            {
                Id = Guid.NewGuid(),
                FileName = request.File.FileName,
                SourceType = fileExtension.Trim('.').ToUpperInvariant(),
                Department = request.Department,
                Tags = request.Tags,
                CreatedAt = DateTime.UtcNow,
                ImportedAt = DateTime.UtcNow,
            };

            var storedPath = await SaveFileAsync(request.File, document.Id, ct);
            _logger.LogInformation("Stored knowledge document {DocumentId} at {Path}", document.Id, storedPath);

            await using var memoryStream = new MemoryStream();
            await request.File.CopyToAsync(memoryStream, ct);
            memoryStream.Position = 0;

            var textContent = await extractor.ExtractTextAsync(memoryStream, ct);
            var chunks = TextChunker.Split(textContent, _options.ChunkSize).ToList();

            if (chunks.Count == 0)
            {
                chunks.Add(string.Empty);
            }

            var knowledgeChunks = new List<KnowledgeChunk>();
            var vectorRecords = new List<VectorRecord>();

            for (var index = 0; index < chunks.Count; index++)
            {
                var chunkText = chunks[index];
                var embedding = await _embeddingClient.GetEmbeddingAsync(chunkText, ct);

                var chunkEntity = new KnowledgeChunk
                {
                    Id = Guid.NewGuid(),
                    DocumentId = document.Id,
                    Content = chunkText,
                    Embedding = embedding,
                    Order = index,
                };

                knowledgeChunks.Add(chunkEntity);

                vectorRecords.Add(new VectorRecord
                {
                    Id = chunkEntity.Id,
                    Content = chunkText,
                    Embedding = embedding,
                    Metadata = new Dictionary<string, string>
                    {
                        ["documentId"] = document.Id.ToString(),
                        ["department"] = document.Department,
                        ["tags"] = document.Tags ?? string.Empty,
                        ["fileName"] = document.FileName,
                        ["sourceType"] = document.SourceType,
                        ["language"] = request.Language ?? string.Empty,
                        ["section"] = chunkEntity.SectionTitle ?? string.Empty,
                    }
                });
            }

            document.Chunks = knowledgeChunks;

            await _dbContext.KnowledgeDocuments.AddAsync(document, ct);
            await _dbContext.KnowledgeChunks.AddRangeAsync(knowledgeChunks, ct);
            await _dbContext.SaveChangesAsync(ct);

            // TODO: Replace with real vector store persistence when available.
            await _vectorStore.StoreAsync(vectorRecords, ct);

            return document;
        }

        private async Task<string> SaveFileAsync(Microsoft.AspNetCore.Http.IFormFile file, Guid documentId, CancellationToken ct)
        {
            var folderName = Path.Combine(_options.StoragePath, DateTime.UtcNow.ToString("yyyy/MM/dd"));
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var sanitizedFileName = Path.GetFileName(file.FileName);
            var storedFileName = $"{documentId}_{sanitizedFileName}";
            var fullPath = Path.Combine(directoryPath, storedFileName);

            await using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream, ct);

            return fullPath;
        }
    }
}
