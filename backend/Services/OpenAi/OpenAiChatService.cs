using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace backend.Services.OpenAi
{
    public class OpenAiChatService
    {
        private readonly HttpClient _httpClient;
        private readonly OpenAiOptions _options;
        private readonly ILogger<OpenAiChatService> _logger;

        public OpenAiChatService(HttpClient httpClient, IOptions<OpenAiOptions> options, ILogger<OpenAiChatService> logger)
        {
            _httpClient = httpClient;
            _options = options.Value;
            _logger = logger;

            _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        }

        public async Task<string> AskAsync(string systemPrompt, string userMessage, string? context, CancellationToken ct = default)
        {
            var messages = new List<object>
            {
                new
                {
                    role = "system",
                    content = systemPrompt,
                }
            };

            if (!string.IsNullOrWhiteSpace(context))
            {
                messages.Add(new
                {
                    role = "assistant",
                    content = $"Kontekst:\n{context}",
                });
            }

            messages.Add(new
            {
                role = "user",
                content = userMessage,
            });

            var payload = new
            {
                model = _options.Model,
                messages,
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, "/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"),
            };

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

            using var response = await _httpClient.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("OpenAI chat call failed: {Status} - {Body}", response.StatusCode, body);
                response.EnsureSuccessStatusCode();
            }

            var json = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(json);
            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return content ?? string.Empty;
        }
    }
}
