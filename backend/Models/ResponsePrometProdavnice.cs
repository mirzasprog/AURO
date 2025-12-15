using System.ComponentModel.DataAnnotations.Schema;

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

    [NotMapped]
    public decimal? NetoKvadraturaObjekta { get; set; }

    [NotMapped]
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
