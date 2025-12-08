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

            var generalAnswer = TryAnswerGeneralQuestion(normalizedQuestion);
            if (generalAnswer != null)
            {
                return new ChatbotResponse
                {
                    Answer = generalAnswer,
                    Fallback = false,
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

            var fuzzyMatches = questionTokens
                .Select(questionToken => topicTokens
                    .Select(topicToken => TokenSimilarity(questionToken, topicToken))
                    .DefaultIfEmpty(0)
                    .Max())
                .Where(score => score >= 0.65)
                .ToList();

            var averageFuzzy = fuzzyMatches.Count > 0
                ? fuzzyMatches.Average()
                : 0;

            var phraseBonus = ContainsPhrase(topic, questionTokens) ? 0.5 : 0;

            return overlap + coverage + density + averageFuzzy * 2 + phraseBonus;
        }

        private static List<string> Tokenize(string text)
        {
            return Regex.Split(text.ToLowerInvariant(), "[^a-zčćžšđ0-9]+")
                .Where(token => token.Length > 2)
                .ToList();
        }

        private static string? TryAnswerGeneralQuestion(string normalizedQuestion)
        {
            var tokens = Tokenize(normalizedQuestion);
            if (tokens.Count == 0)
            {
                return null;
            }

            if (tokens.Any(t => t == "pozdrav" || t == "zdravo" || t == "cao"))
            {
                return "Zdravo! Kako ti mogu pomoći danas? Možeš me pitati za upute ili procese koje koristiš svakodnevno.";
            }

            if (tokens.Any(t => t == "hvala" || t == "hvala!"))
            {
                return "Drago mi je da sam pomogao. Tu sam ako bude trebalo još nešto.";
            }

            if (tokens.Contains("ko") && tokens.Contains("si") || tokens.Contains("sta") && tokens.Contains("si"))
            {
                return "Ja sam AURO asistent za internu bazu znanja. Postavi pitanje o procedurama, aplikacijama ili procesima i pronaći ću uputu.";
            }

            return null;
        }

        private static bool ContainsPhrase(KnowledgeTopic topic, IReadOnlyCollection<string> questionTokens)
        {
            if (questionTokens.Count < 2)
            {
                return false;
            }

            var phrases = BuildPhrases(questionTokens, 2, 3);
            var tema = NormalizeForSearch(topic.Tema);
            var upute = NormalizeForSearch(topic.Upute);

            return phrases.Any(phrase => tema.Contains(phrase) || upute.Contains(phrase));
        }

        private static IEnumerable<string> BuildPhrases(IReadOnlyCollection<string> tokens, int minSize, int maxSize)
        {
            var tokenList = tokens.ToList();
            for (var size = minSize; size <= maxSize; size++)
            {
                for (var i = 0; i <= tokenList.Count - size; i++)
                {
                    yield return string.Join(' ', tokenList.Skip(i).Take(size));
                }
            }
        }

        private static double TokenSimilarity(string left, string right)
        {
            if (left.Equals(right, StringComparison.Ordinal))
            {
                return 1;
            }

            var maxLength = Math.Max(left.Length, right.Length);
            if (maxLength == 0)
            {
                return 1;
            }

            var distance = LevenshteinDistance(left, right);
            return 1 - distance / (double)maxLength;
        }

        private static int LevenshteinDistance(string left, string right)
        {
            var n = left.Length;
            var m = right.Length;
            var matrix = new int[n + 1, m + 1];

            for (var i = 0; i <= n; i++)
            {
                matrix[i, 0] = i;
            }

            for (var j = 0; j <= m; j++)
            {
                matrix[0, j] = j;
            }

            for (var i = 1; i <= n; i++)
            {
                for (var j = 1; j <= m; j++)
                {
                    var cost = left[i - 1] == right[j - 1] ? 0 : 1;
                    matrix[i, j] = Math.Min(
                        Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                        matrix[i - 1, j - 1] + cost);
                }
            }

            return matrix[n, m];
        }

        private static string NormalizeForSearch(string text)
        {
            return string.Join(' ', Tokenize(text));
        }
    }
}
