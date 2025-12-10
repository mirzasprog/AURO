namespace backend.Models
{
    public class CompanyInfoOptions
    {
        public const string SectionName = "CompanyInfo";

        public string CompanyName { get; set; } = "Konzum";
        public string Address { get; set; } = string.Empty;
        public string Jib { get; set; } = string.Empty;
        public string PdvNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Iban { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string Swift { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Web { get; set; } = string.Empty;
    }
}
