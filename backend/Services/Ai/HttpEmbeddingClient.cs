using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace backend.Services.Ai
{
    public class HttpEmbeddingClient : IEmbeddingClient
    {
        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        private readonly HttpClient _httpClient;
        private readonly AiOptions _options;

        public HttpEmbeddingClient(HttpClient httpClient, IOptions<AiOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;
        }

        public async Task<float[]> GetEmbeddingAsync(string text, CancellationToken ct = default)
        {
            var payload = new { text };

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, _options.EmbeddingEndpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(payload, SerializerOptions), Encoding.UTF8, "application/json"),
            };

            if (!string.IsNullOrWhiteSpace(_options.ApiKey))
            {
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
            }

            using var response = await _httpClient.SendAsync(httpRequest, ct);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync(ct);
            var embeddingResponse = JsonSerializer.Deserialize<EmbeddingResponse>(responseContent, SerializerOptions);

            if (embeddingResponse?.Embedding == null)
            {
                throw new InvalidOperationException("Embedding response could not be deserialized.");
            }

            return embeddingResponse.Embedding;
        }

        private class EmbeddingResponse
        {
            public float[] Embedding { get; set; } = Array.Empty<float>();
        }
    }
}
