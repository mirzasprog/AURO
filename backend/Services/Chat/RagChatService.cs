using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using backend.Services.Ai;
using backend.Services.VectorStore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.Chat
{
    public class RagChatService
    {
        private readonly ILlmClient _llmClient;
        private readonly IEmbeddingClient _embeddingClient;
        private readonly IVectorStore _vectorStore;
        private readonly Auro2Context _dbContext;
        private readonly ILogger<RagChatService> _logger;

        public RagChatService(
            ILlmClient llmClient,
            IEmbeddingClient embeddingClient,
            IVectorStore vectorStore,
            Auro2Context dbContext,
            ILogger<RagChatService> logger)
        {
            _llmClient = llmClient;
            _embeddingClient = embeddingClient;
            _vectorStore = vectorStore;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<ChatResponse> AskAsync(ChatRequest request, CancellationToken ct = default)
        {
            var conversationId = request.ConversationId ?? Guid.NewGuid();

            _logger.LogInformation("Starting RAG chat request for user {UserId} in conversation {ConversationId}", request.UserId, conversationId);

            var embedding = await _embeddingClient.GetEmbeddingAsync(request.Question, ct);

            var filters = BuildFilters(request);

            // TODO: Apply authorization filters based on user permissions.
            var searchResults = await _vectorStore.SearchAsync(embedding, Math.Max(1, request.TopK), filters, ct);

            var fileContexts = request.FileContexts ?? Array.Empty<AdHocFileContext>();

            var contextMessage = BuildContextMessage(searchResults, fileContexts);
            var llmRequest = BuildLlmRequest(request.Question, contextMessage, searchResults, fileContexts);

            var llmResponse = await _llmClient.GetChatCompletionAsync(llmRequest, ct);

            await PersistConversationAsync(conversationId, request, llmResponse, ct);

            var usedChunks = searchResults.Select(record => MapToChunkReference(record)).ToList();

            return new ChatResponse
            {
                ConversationId = conversationId,
                Answer = llmResponse.Content,
                UsedChunks = usedChunks,
            };
        }

        private static IReadOnlyDictionary<string, string> BuildFilters(ChatRequest request)
        {
            var filters = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            if (!string.IsNullOrWhiteSpace(request.DepartmentFilter))
            {
                filters["department"] = request.DepartmentFilter!;
            }

            if (request.TagsFilter != null && request.TagsFilter.Any())
            {
                filters["tags"] = string.Join(',', request.TagsFilter);
            }

            return filters;
        }

        private static ChatChunkReference MapToChunkReference(VectorRecord record)
        {
            var metadata = record.Metadata ?? new Dictionary<string, string>();

            Guid? documentId = null;
            if (metadata.TryGetValue("documentId", out var documentIdValue) && Guid.TryParse(documentIdValue, out var parsedDocumentId))
            {
                documentId = parsedDocumentId;
            }

            metadata.TryGetValue("fileName", out var fileName);
            metadata.TryGetValue("section", out var section);

            return new ChatChunkReference
            {
                ChunkId = record.Id,
                DocumentId = documentId,
                FileName = fileName ?? string.Empty,
                Section = section ?? string.Empty,
            };
        }

        private static string BuildContextMessage(IReadOnlyList<VectorRecord> records, IReadOnlyList<AdHocFileContext> fileContexts)
        {
            var builder = new StringBuilder();

            foreach (var record in records)
            {
                var metadata = record.Metadata ?? new Dictionary<string, string>();
                metadata.TryGetValue("fileName", out var fileName);
                metadata.TryGetValue("section", out var section);
                metadata.TryGetValue("documentId", out var documentId);

                builder.AppendLine($"Izvor: {fileName ?? "Nepoznato"} ({documentId}), sekcija: {section ?? "n/a"}");
                builder.AppendLine(record.Content);
                builder.AppendLine();
            }

            if (fileContexts.Any())
            {
                builder.AppendLine("-- Dodatni priloženi fajlovi korisnika --");
            }

            foreach (var fileContext in fileContexts)
            {
                builder.AppendLine($"Prilog: {fileContext.FileName}");
                builder.AppendLine(fileContext.Content);
                builder.AppendLine();
            }

            return builder.ToString();
        }

        private static LlmRequest BuildLlmRequest(
            string question,
            string contextMessage,
            IReadOnlyList<VectorRecord> records,
            IReadOnlyList<AdHocFileContext> fileContexts)
        {
            var systemPrompt = "Ti si interni Konzum360 asistent. Odgovaraj isključivo na osnovu dostavljenog konteksta bez izmišljanja podataka. Odgovori na jeziku korisnika (bosanski/hrvatski). Ako informacija nije dostupna u kontekstu reci da to nije dostupno.";

            var messages = new List<LlmMessage>
            {
                new()
                {
                    Role = "system",
                    Content = contextMessage,
                },
                new()
                {
                    Role = "user",
                    Content = question,
                },
            };

            return new LlmRequest
            {
                SystemPrompt = systemPrompt,
                Messages = messages,
                ContextChunks = records.Select(r => r.Content)
                    .Concat(fileContexts.Select(fc => fc.Content))
                    .ToList(),
            };
        }

        private async Task PersistConversationAsync(Guid conversationId, ChatRequest request, LlmResponse llmResponse, CancellationToken ct)
        {
            var conversation = await _dbContext.ChatConversations
                .AsTracking()
                .FirstOrDefaultAsync(c => c.Id == conversationId, ct);

            if (conversation == null)
            {
                conversation = new ChatConversation
                {
                    Id = conversationId,
                    UserId = request.UserId,
                    CreatedAt = DateTime.UtcNow,
                };

                await _dbContext.ChatConversations.AddAsync(conversation, ct);
            }

            var userMessage = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversationId,
                Role = "user",
                Content = request.Question,
                CreatedAt = DateTime.UtcNow,
            };

            var assistantMessage = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ConversationId = conversationId,
                Role = "assistant",
                Content = llmResponse.Content,
                CreatedAt = DateTime.UtcNow,
            };

            _dbContext.ChatMessages.AddRange(userMessage, assistantMessage);

            await _dbContext.SaveChangesAsync(ct);
        }
    }
}
