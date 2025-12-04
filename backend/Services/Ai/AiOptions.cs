namespace backend.Services.Ai
{
    public class AiOptions
    {
        public const string SectionName = "Ai";

        public string LlmEndpoint { get; set; } = string.Empty;

        public string EmbeddingEndpoint { get; set; } = string.Empty;

        public string ApiKey { get; set; } = string.Empty;
    }
}
