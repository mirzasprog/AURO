namespace backend.Models
{
    public class DailyTaskStoreDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? Format { get; set; }
        public int? ManagerId { get; set; }
        public string? ManagerName { get; set; }
    }
}
