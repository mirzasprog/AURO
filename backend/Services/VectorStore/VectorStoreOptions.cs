namespace backend.Services.VectorStore
{
    public class VectorStoreOptions
    {
        public const string SectionName = "VectorStore";

        public string ConnectionString { get; set; } = string.Empty;

        public string Host { get; set; } = "localhost";

        public int Port { get; set; } = 5432;

        public string Provider { get; set; } = "PgVector";
    }
}
