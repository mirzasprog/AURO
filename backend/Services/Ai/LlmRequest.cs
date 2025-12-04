namespace backend.Services.Ai
{
    public class LlmRequest
    {
        public string SystemPrompt { get; set; } = string.Empty;

        public List<LlmMessage> Messages { get; set; } = new();

        public List<string> ContextChunks { get; set; } = new();
    }
}
