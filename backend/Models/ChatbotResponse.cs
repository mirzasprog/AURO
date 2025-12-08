namespace backend.Models
{
    public class ChatbotResponse
    {
        public string Answer { get; set; } = string.Empty;

        public string? MatchedTopic { get; set; }

        public bool Fallback { get; set; }
    }
}
