namespace backend.Services.Ai
{
    public interface ILlmClient
    {
        Task<LlmResponse> GetChatCompletionAsync(LlmRequest request, CancellationToken ct = default);
    }
}
