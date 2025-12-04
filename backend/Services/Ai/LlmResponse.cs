namespace backend.Services.Ai
{
    public class LlmResponse
    {
        public string Content { get; set; } = string.Empty;

        public LlmUsage? Usage { get; set; }
    }
}
