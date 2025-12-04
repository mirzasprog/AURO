public class ResponsePrometProdavnice
{
    public string BrojProdavnice { get; set; } = null!;
    public string Adresa { get; set; } = null!;
    public string Format { get; set; } = null!;
    public string Regija { get; set; } = null!;
    public decimal Promet { get; set; }
    public decimal PrometProslaGodina { get; set; }
    public int BrojKupaca { get; set; }
    public int BrojKupacaProslaGodina { get; set; }
    public decimal? NetoKvadraturaObjekta { get; set; }
    public decimal? PrometPoNetoKvadraturi { get; set; }
    public decimal? PrometPoUposleniku { get; set; }
}
