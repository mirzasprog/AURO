namespace backend.Services.Knowledge
{
    public class DocumentImportOptions
    {
        public const string SectionName = "DocumentImport";

        public string StoragePath { get; set; } = "Resources/KnowledgeDocuments";

        public int ChunkSize { get; set; } = 800;
    }
}
