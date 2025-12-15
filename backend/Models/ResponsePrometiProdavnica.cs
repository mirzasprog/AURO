using System.ComponentModel.DataAnnotations.Schema;

public class ResponsePrometiProdavnica
{
    public decimal? Promet { get; set; }
    public string? BrojProdavnice { get; set; }
    public string? Regija { get; set; }
    public string? Format { get; set; }
    public string? Adresa { get; set; }
    public decimal? PrometProslaGodina { get; set; }
    public int? BrojKupaca { get; set; }
    public int? BrojKupacaProslaGodina { get; set; }

    [NotMapped]
    public decimal? NetoKvadraturaObjekta { get; set; }    
    
    public decimal? BrojZaposlenih { get; set; }
    
    [NotMapped]
    public decimal? PrometPoZaposlenom { get; set; }

    [NotMapped]
    public decimal? PrometPoNetoKvadraturi { get; set; }

    [NotMapped]
    public decimal? PrometProslaGodinaPoNetoKvadraturi { get; set; }

    [NotMapped]
    public decimal? PrometPoUposleniku { get; set; }
}
