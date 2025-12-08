using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services.Chatbot
{
    public class LocalChatbotService
    {
        private readonly Auro2Context _dbContext;
        private readonly ILogger<LocalChatbotService> _logger;

        public LocalChatbotService(Auro2Context dbContext, ILogger<LocalChatbotService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<ChatbotResponse> AskAsync(string question, CancellationToken ct = default)
        {
            var normalizedQuestion = question?.Trim();
            if (string.IsNullOrWhiteSpace(normalizedQuestion))
            {
                return new ChatbotResponse
                {
                    Answer = "Molimo te da uneseš pitanje.",
                    Fallback = true,
                };
            }

            var topics = await _dbContext.KnowledgeTopics.AsNoTracking().ToListAsync(ct);
            if (topics.Count == 0)
            {
                await StoreUnansweredAsync(normalizedQuestion, ct);
                return new ChatbotResponse
                {
                    Answer = "Baza znanja je prazna pa trenutno nemam odgovor. Molimo te kontaktiraj IT tim.",
                    Fallback = true,
                };
            }

            var tokens = Tokenize(normalizedQuestion);
            var scored = topics
                .Select(topic => new
                {
                    Topic = topic,
                    Score = ScoreTopic(topic, tokens),
                })
                .OrderByDescending(x => x.Score)
                .FirstOrDefault();

            if (scored == null || scored.Score <= 0)
            {
                await StoreUnansweredAsync(normalizedQuestion, ct);
                return new ChatbotResponse
                {
                    Answer = "Na osnovu trenutne baze znanja nemam odgovor na ovo pitanje. Proslijedio sam ga u listu za dopunu.",
                    Fallback = true,
                };
            }

            var answerText = $"Tema: {scored.Topic.Tema}\n{scored.Topic.Upute}";

            return new ChatbotResponse
            {
                Answer = answerText,
                MatchedTopic = scored.Topic.Tema,
                Fallback = false,
            };
        }

        private async Task StoreUnansweredAsync(string question, CancellationToken ct)
        {
            var entity = new UnansweredQuestion
            {
                Question = question,
                CreatedAt = DateTime.UtcNow,
            };

            await _dbContext.UnansweredQuestions.AddAsync(entity, ct);
            await _dbContext.SaveChangesAsync(ct);

            _logger.LogInformation("Stored unanswered question with id {Id}", entity.Id);
        }

        private double ScoreTopic(KnowledgeTopic topic, IReadOnlyCollection<string> questionTokens)
        {
            var topicTokens = Tokenize(topic.Tema)
                .Concat(Tokenize(topic.Upute))
                .ToList();

            if (topicTokens.Count == 0 || questionTokens.Count == 0)
            {
                return 0;
            }

            var topicTokenSet = new HashSet<string>(topicTokens);
            var overlap = questionTokens.Count(token => topicTokenSet.Contains(token));
            var coverage = overlap / (double)questionTokens.Count;
            var density = overlap / (double)topicTokenSet.Count;

            return overlap + coverage + density;
        }

        private static List<string> Tokenize(string text)
        {
            return Regex.Split(text.ToLowerInvariant(), "[^a-zčćžšđ0-9]+")
                .Where(token => token.Length > 2)
                .ToList();
        }
    }
}
