namespace backend.Models
{
    public class VikendAkcijaProduzenjeResult
    {
        public bool AkcijaPronadjena { get; set; }
        public bool Produzeno { get; set; }
        public string Poruka { get; set; } = string.Empty;
        public VikendAkcijaDto? Akcija { get; set; }
    }
}
