using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AkcijeStavkeResponse",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "AkcijeZaglavljeResponse",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    NazivAkcije = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pocetak = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Kraj = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ArtikliIzdatniceDetalji",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ArtikliNeuslovneRobeDetalji",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogNeuslovnosti = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogPrisustva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtpisPovrat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Napomena = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ChatConversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatConversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DailyTaskTemplate",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    ImageAllowed = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DefaultStatus = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTaskTemplate", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "DatumOtpisa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumOd = table.Column<DateTime>(type: "datetime", nullable: false),
                    DatumDo = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatumOtpisa", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DetaljiArtiklaReklamacija",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiRedovnogOtpisa",
                columns: table => new
                {
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProvedenoSnizenje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumIstekaRoka = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiRedovnogOtpisaOdbijeno",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProvedenoSnizenje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Odbio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Komentar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KomentarOtpis = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiRedovnogOtpisaOdobreno",
                columns: table => new
                {
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProvedenoSnizenje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumIstekaRoka = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiVanrednogOtpisa",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebnoZbrinjavanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebanTransport = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiVanrednogOtpisaOdbijeno",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Odbio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Komentar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KomentarOtpis = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "DetaljiVanrednogOtpisaOdobreno",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Barkod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebnoZbrinjavanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebanTransport = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Dobavljac",
                columns: table => new
                {
                    DobavljacID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Sifra = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Aktivnost = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Grad = table.Column<string>(type: "nchar(50)", fixedLength: true, maxLength: 50, nullable: true),
                    Drzava = table.Column<string>(type: "nchar(50)", fixedLength: true, maxLength: 50, nullable: true),
                    KontaktNaziv = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Kontakt = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dobavljac", x => x.DobavljacID);
                });

            migrationBuilder.CreateTable(
                name: "GetPodaciReklamacije",
                columns: table => new
                {
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumPrijema = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Komentar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SifraArtikla = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kolicina = table.Column<int>(type: "int", nullable: false),
                    BrojDokumenta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReklamiranaKolicina = table.Column<int>(type: "int", nullable: false),
                    Lot = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojZaduzenjaMLP = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "GetPodaciUposlenikaParcijalnaInv",
                columns: table => new
                {
                    IDHR = table.Column<int>(type: "int", nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "GetUposlenici",
                columns: table => new
                {
                    Zaposlenik = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "IzvjestajIzdatnica",
                columns: table => new
                {
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojIzdatnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kategorija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SifraArtikla = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Snizenje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pkol = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mpc = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SifraDobavljaca = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NazivDobavljaca = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "IzvjestajParcijalnaInventuraInternaKontrola",
                columns: table => new
                {
                    OznakaOJ = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NazivOj = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Entitet = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojIzDesa = table.Column<int>(type: "int", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NaknadaPoZaposleniku = table.Column<int>(type: "int", nullable: false),
                    BrojDana = table.Column<int>(type: "int", nullable: false),
                    BrojSati = table.Column<int>(type: "int", nullable: false),
                    DatumInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IznosZaIsplatu = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PodrucniVoditelj = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VrstaInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "IzvjestajPotpunihInventuraInterna",
                columns: table => new
                {
                    OrgUposlenika = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NazivOj = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Entitet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojIzDesa = table.Column<int>(type: "int", nullable: true),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojDana = table.Column<int>(type: "int", nullable: true),
                    BrojSati = table.Column<int>(type: "int", nullable: true),
                    DatumInventure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IznosZaIsplatu = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PodrucniVoditelj = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VrstaInventure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojMinuta = table.Column<int>(type: "int", nullable: true),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "IzvjestajTrgovackaKnjigaAnalitika",
                columns: table => new
                {
                    Datum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Distributer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojTransakcija = table.Column<int>(type: "int", nullable: false),
                    ProdajaBezPDV = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PDV = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ProdajaSaPDV = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Provizija = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PorezNaProviziju = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnoSaPDV = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "IzvjestajTrgovackaKnjigaSintetika",
                columns: table => new
                {
                    Rbr = table.Column<int>(type: "int", nullable: false),
                    Datum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UkupnoNaknadaSaPDV = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Kategorija",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategorija", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KnowledgeDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    SourceType = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Tags = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImportedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnowledgeDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KnowledgeDocumentsRag",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Embedding = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnowledgeDocumentsRag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KnowledgeTopics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tema = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Upute = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnowledgeTopics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KontrolneInventure",
                columns: table => new
                {
                    BrojInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InventurnaVrijednost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KnjigovodstvenaVrijednost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InventurnaRazlika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Klasifikacija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grupa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Korisnik",
                columns: table => new
                {
                    KorisnikID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KorisnickoIme = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Lozinka = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Uloga = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Aktivan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnik", x => x.KorisnikID);
                });

            migrationBuilder.CreateTable(
                name: "ListaZaposlenikaParcijalneInventure",
                columns: table => new
                {
                    BrojIzDESa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Rm = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    NazivOrg = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Entitet = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumUcitavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PV = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "NemaOtpisa",
                columns: table => new
                {
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumUnosa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "NetoPovrsinaProd",
                columns: table => new
                {
                    BrojProdavnice = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    NetoPovrsina = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "NovaIzdatnica",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Komentar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DatumIzradeIzdatnice = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "OvjeraOtpisa",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojOtpisa = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    MenadzerID = table.Column<int>(type: "int", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    Komentar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StatusID = table.Column<int>(type: "int", nullable: true),
                    Datum = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OvjeraOtpisa", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ParcijalnaInventura",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IznosZaIsplatu = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrojSati = table.Column<int>(type: "int", nullable: false),
                    BrojMinuta = table.Column<int>(type: "int", nullable: false),
                    BrojDana = table.Column<int>(type: "int", nullable: false),
                    DatumInventure = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    BrojDokumenta = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PodrucniVoditelj = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojIzDESa = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Napomena = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VrstaInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParcijalnaInventura", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ParcijalnaInventuraImportZaposlenika",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojIzMaticneKnjige = table.Column<int>(type: "int", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RadnoMjesto = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OznakaOJ = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    NazivOJ = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    Entitet = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Format = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    DatumUcitavanja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PodrucniVoditelj = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParcijalnaInventuraImportZaposlenika", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "PDTartikliRedovnogOtpisa",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Kolicina = table.Column<double>(type: "float", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProvedenoSnizenje = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PDTartikliVanrednogOtpisa",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Kolicina = table.Column<double>(type: "float", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebanTransport = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebnoZbrinjavanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PDTdokumenti",
                columns: table => new
                {
                    SifraDokumenta = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PDTizdatniceTroska",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaCijena = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Kolicina = table.Column<double>(type: "float", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UkupnaVrijednostMPC = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednostNC = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Cijena = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumIzradeIzdatnice = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PDTNeuslovnaRoba",
                columns: table => new
                {
                    sifraArtikla = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Kolicina = table.Column<double>(type: "float", nullable: false),
                    razlogPrisustva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogNeuslovnosti = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OtpisPovrat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ukupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Podkategorija",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Podkategorija", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PregledDinamike",
                columns: table => new
                {
                    DatumOd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumDo = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledIzdatnica",
                columns: table => new
                {
                    BrojIzdatnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledIzdatnicaInterna",
                columns: table => new
                {
                    BrojIzdatnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledNeuslovneRobe",
                columns: table => new
                {
                    prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojNeuslovneRobe = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledOtpisa",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledOtpisaInterna",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumOvjerePodrucnog = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DatumOvjereRegionalnog = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "PregledUcesnika",
                columns: table => new
                {
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojProdavniceUcesnika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VrijemePocetka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VrijemeZavrsetka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ProdavniceBezOtpisa",
                columns: table => new
                {
                    DatumUnosa = table.Column<DateTime>(type: "date", nullable: false),
                    BrojProdavnice = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProdavniceBezOtpisa", x => new { x.DatumUnosa, x.BrojProdavnice });
                });

            migrationBuilder.CreateTable(
                name: "PrometiHistorija",
                columns: table => new
                {
                    PrometID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum = table.Column<DateTime>(type: "date", nullable: false),
                    Godina = table.Column<int>(type: "int", nullable: false),
                    Mjesec = table.Column<int>(type: "int", nullable: false),
                    Dan = table.Column<int>(type: "int", nullable: false),
                    UkupniPromet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrojKupaca = table.Column<int>(type: "int", nullable: true),
                    DatumUnosa = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrometiHistorija", x => x.PrometID);
                });

            migrationBuilder.CreateTable(
                name: "PrometProdavnice",
                columns: table => new
                {
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Regija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Promet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PrometProslaGodina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrojKupaca = table.Column<int>(type: "int", nullable: false),
                    BrojKupacaProslaGodina = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "RequestParcijalneInventure",
                columns: table => new
                {
                    DatumInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Pv = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojDokumenta = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "RequestParcijalneInventureZaposlenik",
                columns: table => new
                {
                    IznosZaIsplatu = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrojSati = table.Column<int>(type: "int", nullable: false),
                    BrojDana = table.Column<int>(type: "int", nullable: false),
                    BrojMinuta = table.Column<int>(type: "int", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    OrgJedUposlenika = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    BrojIzDESa = table.Column<int>(type: "int", nullable: false),
                    VrstaInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ResponseParcijalneInventurePodrucni",
                columns: table => new
                {
                    IznosZaIsplatu = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BrojSati = table.Column<int>(type: "int", nullable: false),
                    BrojDana = table.Column<int>(type: "int", nullable: false),
                    DatumInventure = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PodrucniVoditelj = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BrojIzDESa = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ResponseParcijalneInventurePodrucniZaglavlje",
                columns: table => new
                {
                    BrojProd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Datum = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VrstaInventure = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Podrucni = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Napomena = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojDokumenta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ukupno = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ResponseProdavniceParcijalnaInventuraNezavrseno",
                columns: table => new
                {
                    Prodavnice = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ResponsePrometiProdavnica",
                columns: table => new
                {
                    Promet = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BrojProdavnice = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Regija = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Format = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrometProslaGodina = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    BrojKupaca = table.Column<int>(type: "int", nullable: true),
                    BrojKupacaProslaGodina = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ResponseZaposleniciParcijalneInventure",
                columns: table => new
                {
                    BrojIzDESa = table.Column<int>(type: "int", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Pv = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OrgJed = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    NazivOrg = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Entitet = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Format = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ServiceInvoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "date", nullable: false),
                    DueDate = table.Column<DateTime>(type: "date", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    CustomerAddress = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CustomerCity = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    CustomerCountry = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    CustomerTaxId = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    Currency = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    SubtotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false, defaultValue: "Kreirano")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceInvoices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Statistika",
                columns: table => new
                {
                    ResultBrojRedovnog = table.Column<int>(type: "int", nullable: false),
                    ResultBrojVanrednog = table.Column<int>(type: "int", nullable: false),
                    ResultIzdatnica = table.Column<int>(type: "int", nullable: false),
                    ResultNeuslovnaRoba = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "Status",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Status", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "T_DatumOdobravanjaInventure",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumOd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumDo = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_DatumOdobravanjaInventure", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_ReklamacijeKvaliteta",
                columns: table => new
                {
                    SifraArtikla = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Datum = table.Column<DateTime>(type: "date", nullable: false),
                    DatumPrijema = table.Column<DateTime>(type: "date", nullable: false),
                    JedinicaMjere = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Komentar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    BrojProdavnice = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Kolicina = table.Column<int>(type: "int", nullable: false),
                    BrojDokumenta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lot = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ReklamiranaKolicina = table.Column<int>(type: "int", nullable: false),
                    BrojZaduzenjaMLP = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_ReklamacijeKvaliteta", x => x.SifraArtikla);
                });

            migrationBuilder.CreateTable(
                name: "TipOtpisa",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipOtpisa = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipOtpisa", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TKUANALITIKA",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PRODAVNICA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DATUM = table.Column<DateTime>(type: "datetime", nullable: true),
                    DISTRIBUTER = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BROJTRANSAKCIJA = table.Column<int>(type: "int", nullable: true),
                    PRODAJABEZPDV = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PDV = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PRODAJASAPDV = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PROVIZIJA = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    POREZNAPROVIZIJU = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UKUPNOSAPDV = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TKUANALITIKA", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TKUSINTETIKA",
                columns: table => new
                {
                    KOMITENT = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false, defaultValueSql: "('')"),
                    PRODAVNICA = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    DATUM = table.Column<DateTime>(type: "datetime", nullable: false),
                    RBR = table.Column<int>(type: "int", nullable: true),
                    OPIS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IZNOSNAKNADESAPDV = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dbo.TKUSINTETIKA", x => new { x.KOMITENT, x.PRODAVNICA, x.DATUM });
                });

            migrationBuilder.CreateTable(
                name: "UcesniciInventure",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Datum = table.Column<DateTime>(type: "datetime", nullable: false),
                    BrojProdavnice = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    BrojProdavniceUcesnika = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    VrijemePocetka = table.Column<DateTime>(type: "datetime", nullable: false),
                    VrijemeZavrsetka = table.Column<DateTime>(type: "datetime", nullable: false),
                    RolaNaInventuri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "UnansweredQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnansweredQuestions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnosDatumaOtpisa",
                columns: table => new
                {
                    DatumOd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumDo = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "VikendAkcijaStavkaDto",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "VIPArtikli",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IDAkcije = table.Column<string>(type: "nvarchar(64)", nullable: true),
                    NazivArtk = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SifraArtk = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VIPArtikli", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VIPZaglavlje",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Opis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pocetak = table.Column<DateTime>(type: "datetime", nullable: false),
                    Kraj = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UniqueId = table.Column<string>(type: "nvarchar(64)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VIPZaglavlje", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviIzdatnice",
                columns: table => new
                {
                    BrojIzdatnice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviIzdatniceDetalji",
                columns: table => new
                {
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NazivArtikla = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Komentar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviRedovniOtpis",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviRedovniOtpisDetalji",
                columns: table => new
                {
                    ArtikalId = table.Column<int>(type: "int", nullable: false),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NazivArtikla = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviVanredniOtpis",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZahtjeviVanredniOtpisDetalji",
                columns: table => new
                {
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    Sifra = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PotrebnoZbrinjavanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PotrebanTransport = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NazivArtikla = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dobavljac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NabavnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZavrseniRedovniZahtjevi",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ZavrseniVanredniZahtjevi",
                columns: table => new
                {
                    BrojOtpisa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumPopunjavanja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatConversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "ChatConversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Artikal",
                columns: table => new
                {
                    ArtikalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Barkod = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: true),
                    Naziv = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    JedinicaMjere = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: true),
                    KategorijaID = table.Column<int>(type: "int", nullable: true),
                    PodkategorijaID = table.Column<int>(type: "int", nullable: true),
                    Sifra = table.Column<string>(type: "nchar(25)", fixedLength: true, maxLength: 25, nullable: true),
                    Aktivnost = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: true),
                    DobavljacID = table.Column<int>(type: "int", nullable: true),
                    KAL = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    SA0 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    MO0 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    SA4 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    BL0 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    TZ0 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    ZH0 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    ZC1 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    ZC6 = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    MERC = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    VEL = table.Column<decimal>(type: "numeric(20,4)", nullable: true),
                    Cijena = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NabavnaCijena = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artikal", x => x.ArtikalID);
                    table.ForeignKey(
                        name: "FK_Artikal_Dobavljac",
                        column: x => x.DobavljacID,
                        principalTable: "Dobavljac",
                        principalColumn: "DobavljacID");
                });

            migrationBuilder.CreateTable(
                name: "KnowledgeChunks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Embedding = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: true),
                    SectionTitle = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnowledgeChunks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KnowledgeChunks_KnowledgeDocuments_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "KnowledgeDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Menadzer",
                columns: table => new
                {
                    KorisnikID = table.Column<int>(type: "int", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NazivRadnogMjesta = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menadzer", x => x.KorisnikID);
                    table.ForeignKey(
                        name: "FK_Menadzer_Menadzer",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "Prodavnica",
                columns: table => new
                {
                    KorisnikID = table.Column<int>(type: "int", nullable: false),
                    BrojProdavnice = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: false),
                    NazivCjenika = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Mjesto = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    MenadzerID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prodavnica", x => x.KorisnikID);
                    table.ForeignKey(
                        name: "FK_Prodavnica_Korisnik",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "ServiceInvoiceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceInvoiceId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    LineTotalWithoutTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LineTaxAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LineTotalWithTax = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceInvoiceItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceInvoiceItems_ServiceInvoices_ServiceInvoiceId",
                        column: x => x.ServiceInvoiceId,
                        principalTable: "ServiceInvoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VIPStavkes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SifraArtikla = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NazivArtikla = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Prodavnica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VIPZaglavlje_Id = table.Column<int>(type: "int", nullable: true),
                    VrijemeUnosaSaSourcea = table.Column<DateTime>(type: "datetime", nullable: true),
                    VrijemeUnosaIzProdavnice = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VIPStavkes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_dbo.VIPStavkes_dbo.VIPZaglavlje_VIPZaglavlje_Id",
                        column: x => x.VIPZaglavlje_Id,
                        principalTable: "VIPZaglavlje",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Otpis",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumKreiranja = table.Column<DateTime>(type: "date", nullable: true),
                    BrojOtpisa = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TipOtpisaID = table.Column<int>(type: "int", nullable: false),
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    PodnosiocID = table.Column<int>(type: "int", nullable: false),
                    RazlogOtpisa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Napomena = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PotrebnoZbrinjavanje = table.Column<string>(type: "char(2)", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    PotrebanTransport = table.Column<string>(type: "char(2)", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    ProvedenoSnizenje = table.Column<string>(type: "char(2)", unicode: false, fixedLength: true, maxLength: 2, nullable: true),
                    KomentarVanrednogOtpisa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DatumIstekaRoka = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Otpis", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Otpis_Artikal",
                        column: x => x.ArtikalID,
                        principalTable: "Artikal",
                        principalColumn: "ArtikalID");
                    table.ForeignKey(
                        name: "FK_Otpis_Korisnik",
                        column: x => x.PodnosiocID,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_Otpis_TipOtpisa",
                        column: x => x.TipOtpisaID,
                        principalTable: "TipOtpisa",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "DailyTask",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    Type = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    ProdavnicaId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedById = table.Column<int>(type: "int", nullable: true),
                    CompletionNote = table.Column<string>(type: "varchar(2000)", unicode: false, maxLength: 2000, nullable: true),
                    ImageAllowed = table.Column<bool>(type: "bit", nullable: false),
                    ImageAttachment = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    TemplateId = table.Column<int>(type: "int", nullable: true),
                    IsRecurring = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyTask", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DailyTask_CompletedBy",
                        column: x => x.CompletedById,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_DailyTask_CreatedBy",
                        column: x => x.CreatedById,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_DailyTask_Prodavnica",
                        column: x => x.ProdavnicaId,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_DailyTask_Template",
                        column: x => x.TemplateId,
                        principalTable: "DailyTaskTemplate",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "HijerarhijaOdobravanja",
                columns: table => new
                {
                    MenadzerID = table.Column<int>(type: "int", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    RedniBroj = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HijerarhijaOdobravanja", x => new { x.MenadzerID, x.ProdavnicaID });
                    table.ForeignKey(
                        name: "FK_HijerarhijaOdobravanja_Menadzer",
                        column: x => x.MenadzerID,
                        principalTable: "Menadzer",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_HijerarhijaOdobravanja_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "Inventura",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Broj = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Datum = table.Column<DateTime>(type: "datetime", nullable: false),
                    InventurnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    KnjigovodstvenaVrijednost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Kategorija = table.Column<int>(type: "int", nullable: false),
                    Podkategorija = table.Column<int>(type: "int", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    DatumUnosa = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventura", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inventura_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "Izdatnica",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumKreiranja = table.Column<DateTime>(type: "date", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    Razlog = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Komentar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BrojIzdatnice = table.Column<string>(type: "varchar(13)", unicode: false, maxLength: 13, nullable: true),
                    DatumIzradeIzdatnice = table.Column<DateTime>(type: "date", nullable: true),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Izdatnica", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Izdatnica_Artikal",
                        column: x => x.ArtikalID,
                        principalTable: "Artikal",
                        principalColumn: "ArtikalID");
                    table.ForeignKey(
                        name: "FK_Izdatnica_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "NeuslovnaRoba",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumKreiranja = table.Column<DateTime>(type: "datetime", nullable: false),
                    ArtikalID = table.Column<int>(type: "int", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    Kolicina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UkupnaVrijednost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RazlogNeuslovnosti = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    OtpisPovrat = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RazlogPrisustva = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Napomena = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StatusID = table.Column<int>(type: "int", nullable: true),
                    BrojNeuslovneRobe = table.Column<string>(type: "varchar(13)", unicode: false, maxLength: 13, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NeuslovnaRoba", x => x.ID);
                    table.ForeignKey(
                        name: "FK_NeuslovnaRoba_Artikal",
                        column: x => x.ArtikalID,
                        principalTable: "Artikal",
                        principalColumn: "ArtikalID");
                    table.ForeignKey(
                        name: "FK_NeuslovnaRoba_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_NeuslovnaRoba_Status",
                        column: x => x.StatusID,
                        principalTable: "Status",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ArtikalOvjeraOtpisa",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenadzerID = table.Column<int>(type: "int", nullable: false),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    StatusID = table.Column<int>(type: "int", nullable: true),
                    DatumOvjere = table.Column<DateTime>(type: "datetime", nullable: true),
                    Komentar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OtpisID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtikalOvjeraOtpisa", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ArtikalOvjeraOtpisa_Menadzer",
                        column: x => x.MenadzerID,
                        principalTable: "Menadzer",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_ArtikalOvjeraOtpisa_Otpis",
                        column: x => x.OtpisID,
                        principalTable: "Otpis",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ArtikalOvjeraOtpisa_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                    table.ForeignKey(
                        name: "FK_ArtikalOvjeraOtpisa_Status",
                        column: x => x.StatusID,
                        principalTable: "Status",
                        principalColumn: "ID");
                });

            migrationBuilder.InsertData(
                table: "DailyTaskTemplate",
                columns: new[] { "ID", "DefaultStatus", "Description", "ImageAllowed", "IsActive", "Title" },
                values: new object[,]
                {
                    { 1, "OPEN", "Provjeriti zalihe i naručiti potrebnu robu za market.", false, true, "Naručivanje robe za market" },
                    { 2, "OPEN", "Provjeriti da li su cijene na policama usklađene sa sistemom.", true, true, "Provjera cijena" },
                    { 3, "OPEN", "Osigurati da su sve narudžbe za VIP odjel završene do 10 sati.", false, true, "Narudžba za VIP odjel do 10 sati" },
                    { 4, "OPEN", "Provjeriti sve uređaje u marketu i evidentirati eventualne kvarove.", true, true, "Provjera funkcionalnosti uređaja u marketu" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Artikal_DobavljacID",
                table: "Artikal",
                column: "DobavljacID");

            migrationBuilder.CreateIndex(
                name: "IX_ArtikalOvjeraOtpisa_MenadzerID",
                table: "ArtikalOvjeraOtpisa",
                column: "MenadzerID");

            migrationBuilder.CreateIndex(
                name: "IX_ArtikalOvjeraOtpisa_OtpisID",
                table: "ArtikalOvjeraOtpisa",
                column: "OtpisID");

            migrationBuilder.CreateIndex(
                name: "IX_ArtikalOvjeraOtpisa_ProdavnicaID",
                table: "ArtikalOvjeraOtpisa",
                column: "ProdavnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_ArtikalOvjeraOtpisa_StatusID",
                table: "ArtikalOvjeraOtpisa",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ConversationId",
                table: "ChatMessages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTask_CompletedById",
                table: "DailyTask",
                column: "CompletedById");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTask_CreatedById",
                table: "DailyTask",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTask_ProdavnicaId",
                table: "DailyTask",
                column: "ProdavnicaId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyTask_TemplateId",
                table: "DailyTask",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_HijerarhijaOdobravanja_ProdavnicaID",
                table: "HijerarhijaOdobravanja",
                column: "ProdavnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Inventura_ProdavnicaID",
                table: "Inventura",
                column: "ProdavnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_Izdatnica_ArtikalID",
                table: "Izdatnica",
                column: "ArtikalID");

            migrationBuilder.CreateIndex(
                name: "IX_Izdatnica_ProdavnicaID",
                table: "Izdatnica",
                column: "ProdavnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_KnowledgeChunks_DocumentId",
                table: "KnowledgeChunks",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_NeuslovnaRoba_ArtikalID",
                table: "NeuslovnaRoba",
                column: "ArtikalID");

            migrationBuilder.CreateIndex(
                name: "IX_NeuslovnaRoba_ProdavnicaID",
                table: "NeuslovnaRoba",
                column: "ProdavnicaID");

            migrationBuilder.CreateIndex(
                name: "IX_NeuslovnaRoba_StatusID",
                table: "NeuslovnaRoba",
                column: "StatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Otpis_ArtikalID",
                table: "Otpis",
                column: "ArtikalID");

            migrationBuilder.CreateIndex(
                name: "IX_Otpis_PodnosiocID",
                table: "Otpis",
                column: "PodnosiocID");

            migrationBuilder.CreateIndex(
                name: "IX_Otpis_TipOtpisaID",
                table: "Otpis",
                column: "TipOtpisaID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceInvoiceItems_ServiceInvoiceId",
                table: "ServiceInvoiceItems",
                column: "ServiceInvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_VIPStavkes_VIPZaglavlje_Id",
                table: "VIPStavkes",
                column: "VIPZaglavlje_Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AkcijeStavkeResponse");

            migrationBuilder.DropTable(
                name: "AkcijeZaglavljeResponse");

            migrationBuilder.DropTable(
                name: "ArtikalOvjeraOtpisa");

            migrationBuilder.DropTable(
                name: "ArtikliIzdatniceDetalji");

            migrationBuilder.DropTable(
                name: "ArtikliNeuslovneRobeDetalji");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "DailyTask");

            migrationBuilder.DropTable(
                name: "DatumOtpisa");

            migrationBuilder.DropTable(
                name: "DetaljiArtiklaReklamacija");

            migrationBuilder.DropTable(
                name: "DetaljiRedovnogOtpisa");

            migrationBuilder.DropTable(
                name: "DetaljiRedovnogOtpisaOdbijeno");

            migrationBuilder.DropTable(
                name: "DetaljiRedovnogOtpisaOdobreno");

            migrationBuilder.DropTable(
                name: "DetaljiVanrednogOtpisa");

            migrationBuilder.DropTable(
                name: "DetaljiVanrednogOtpisaOdbijeno");

            migrationBuilder.DropTable(
                name: "DetaljiVanrednogOtpisaOdobreno");

            migrationBuilder.DropTable(
                name: "GetPodaciReklamacije");

            migrationBuilder.DropTable(
                name: "GetPodaciUposlenikaParcijalnaInv");

            migrationBuilder.DropTable(
                name: "GetUposlenici");

            migrationBuilder.DropTable(
                name: "HijerarhijaOdobravanja");

            migrationBuilder.DropTable(
                name: "Inventura");

            migrationBuilder.DropTable(
                name: "Izdatnica");

            migrationBuilder.DropTable(
                name: "IzvjestajIzdatnica");

            migrationBuilder.DropTable(
                name: "IzvjestajParcijalnaInventuraInternaKontrola");

            migrationBuilder.DropTable(
                name: "IzvjestajPotpunihInventuraInterna");

            migrationBuilder.DropTable(
                name: "IzvjestajTrgovackaKnjigaAnalitika");

            migrationBuilder.DropTable(
                name: "IzvjestajTrgovackaKnjigaSintetika");

            migrationBuilder.DropTable(
                name: "Kategorija");

            migrationBuilder.DropTable(
                name: "KnowledgeChunks");

            migrationBuilder.DropTable(
                name: "KnowledgeDocumentsRag");

            migrationBuilder.DropTable(
                name: "KnowledgeTopics");

            migrationBuilder.DropTable(
                name: "KontrolneInventure");

            migrationBuilder.DropTable(
                name: "ListaZaposlenikaParcijalneInventure");

            migrationBuilder.DropTable(
                name: "NemaOtpisa");

            migrationBuilder.DropTable(
                name: "NetoPovrsinaProd");

            migrationBuilder.DropTable(
                name: "NeuslovnaRoba");

            migrationBuilder.DropTable(
                name: "NovaIzdatnica");

            migrationBuilder.DropTable(
                name: "OvjeraOtpisa");

            migrationBuilder.DropTable(
                name: "ParcijalnaInventura");

            migrationBuilder.DropTable(
                name: "ParcijalnaInventuraImportZaposlenika");

            migrationBuilder.DropTable(
                name: "PDTartikliRedovnogOtpisa");

            migrationBuilder.DropTable(
                name: "PDTartikliVanrednogOtpisa");

            migrationBuilder.DropTable(
                name: "PDTdokumenti");

            migrationBuilder.DropTable(
                name: "PDTizdatniceTroska");

            migrationBuilder.DropTable(
                name: "PDTNeuslovnaRoba");

            migrationBuilder.DropTable(
                name: "Podkategorija");

            migrationBuilder.DropTable(
                name: "PregledDinamike");

            migrationBuilder.DropTable(
                name: "PregledIzdatnica");

            migrationBuilder.DropTable(
                name: "PregledIzdatnicaInterna");

            migrationBuilder.DropTable(
                name: "PregledNeuslovneRobe");

            migrationBuilder.DropTable(
                name: "PregledOtpisa");

            migrationBuilder.DropTable(
                name: "PregledOtpisaInterna");

            migrationBuilder.DropTable(
                name: "PregledUcesnika");

            migrationBuilder.DropTable(
                name: "ProdavniceBezOtpisa");

            migrationBuilder.DropTable(
                name: "PrometiHistorija");

            migrationBuilder.DropTable(
                name: "PrometProdavnice");

            migrationBuilder.DropTable(
                name: "RequestParcijalneInventure");

            migrationBuilder.DropTable(
                name: "RequestParcijalneInventureZaposlenik");

            migrationBuilder.DropTable(
                name: "ResponseParcijalneInventurePodrucni");

            migrationBuilder.DropTable(
                name: "ResponseParcijalneInventurePodrucniZaglavlje");

            migrationBuilder.DropTable(
                name: "ResponseProdavniceParcijalnaInventuraNezavrseno");

            migrationBuilder.DropTable(
                name: "ResponsePrometiProdavnica");

            migrationBuilder.DropTable(
                name: "ResponseZaposleniciParcijalneInventure");

            migrationBuilder.DropTable(
                name: "ServiceInvoiceItems");

            migrationBuilder.DropTable(
                name: "Statistika");

            migrationBuilder.DropTable(
                name: "T_DatumOdobravanjaInventure");

            migrationBuilder.DropTable(
                name: "tbl_ReklamacijeKvaliteta");

            migrationBuilder.DropTable(
                name: "TKUANALITIKA");

            migrationBuilder.DropTable(
                name: "TKUSINTETIKA");

            migrationBuilder.DropTable(
                name: "UcesniciInventure");

            migrationBuilder.DropTable(
                name: "UnansweredQuestions");

            migrationBuilder.DropTable(
                name: "UnosDatumaOtpisa");

            migrationBuilder.DropTable(
                name: "VikendAkcijaStavkaDto");

            migrationBuilder.DropTable(
                name: "VIPArtikli");

            migrationBuilder.DropTable(
                name: "VIPStavkes");

            migrationBuilder.DropTable(
                name: "ZahtjeviIzdatnice");

            migrationBuilder.DropTable(
                name: "ZahtjeviIzdatniceDetalji");

            migrationBuilder.DropTable(
                name: "ZahtjeviRedovniOtpis");

            migrationBuilder.DropTable(
                name: "ZahtjeviRedovniOtpisDetalji");

            migrationBuilder.DropTable(
                name: "ZahtjeviVanredniOtpis");

            migrationBuilder.DropTable(
                name: "ZahtjeviVanredniOtpisDetalji");

            migrationBuilder.DropTable(
                name: "ZavrseniRedovniZahtjevi");

            migrationBuilder.DropTable(
                name: "ZavrseniVanredniZahtjevi");

            migrationBuilder.DropTable(
                name: "Otpis");

            migrationBuilder.DropTable(
                name: "ChatConversations");

            migrationBuilder.DropTable(
                name: "DailyTaskTemplate");

            migrationBuilder.DropTable(
                name: "Menadzer");

            migrationBuilder.DropTable(
                name: "KnowledgeDocuments");

            migrationBuilder.DropTable(
                name: "Prodavnica");

            migrationBuilder.DropTable(
                name: "Status");

            migrationBuilder.DropTable(
                name: "ServiceInvoices");

            migrationBuilder.DropTable(
                name: "VIPZaglavlje");

            migrationBuilder.DropTable(
                name: "Artikal");

            migrationBuilder.DropTable(
                name: "TipOtpisa");

            migrationBuilder.DropTable(
                name: "Korisnik");

            migrationBuilder.DropTable(
                name: "Dobavljac");
        }
    }
}
