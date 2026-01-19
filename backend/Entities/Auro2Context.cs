using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Models.Prometi;

namespace backend.Entities
{
    public partial class Auro2Context : DbContext
    {
        public Auro2Context()
        {
        }

        public Auro2Context(DbContextOptions<Auro2Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Artikal> Artikal { get; set; } = null!;
        public virtual DbSet<ArtikalOvjeraOtpisa> ArtikalOvjeraOtpisa { get; set; } = null!;
        public virtual DbSet<DailyTask> DailyTask { get; set; } = null!;
        public virtual DbSet<DailyTaskTemplate> DailyTaskTemplate { get; set; } = null!;
        public virtual DbSet<DatumOtpisa> DatumOtpisa { get; set; } = null!;
        public virtual DbSet<DatumOdobravanjaInventure> T_DatumOdobravanjaInventure { get; set; } = null!;
        public virtual DbSet<Dobavljac> Dobavljac { get; set; } = null!;
        public virtual DbSet<HijerarhijaOdobravanja> HijerarhijaOdobravanja { get; set; } = null!;
        public virtual DbSet<Inventura> Inventura { get; set; } = null!;
        public virtual DbSet<Izdatnica> Izdatnica { get; set; } = null!;
        public virtual DbSet<Kategorija> Kategorija { get; set; } = null!;
        public virtual DbSet<Statistika> Statistika { get; set; } = null!;
        public virtual DbSet<Korisnik> Korisnik { get; set; } = null!;
        public virtual DbSet<Menadzer> Menadzer { get; set; } = null!;
        public virtual DbSet<NeuslovnaRoba> NeuslovnaRoba { get; set; } = null!;
        public virtual DbSet<Otpis> Otpis { get; set; } = null!;        
        public virtual DbSet<DetaljiArtiklaReklamacija> DetaljiArtiklaReklamacija { get; set; } = null!;
        public virtual DbSet<tbl_ReklamacijeKvaliteta > tbl_ReklamacijeKvaliteta { get; set; } = null!;
        public virtual DbSet<OvjeraOtpisa> OvjeraOtpisa { get; set; } = null!;
        public virtual DbSet<Podkategorija> Podkategorija { get; set; } = null!;
        public virtual DbSet<Prodavnica> Prodavnica { get; set; } = null!;
        public virtual DbSet<ProdavniceBezOtpisa> ProdavniceBezOtpisa { get; set; } = null!;
        public virtual DbSet<Status> Status { get; set; } = null!;
        public virtual DbSet<TipOtpisa> TipOtpisa { get; set; } = null!;
        public virtual DbSet<Tkuanalitika> Tkuanalitika { get; set; } = null!;
        public virtual DbSet<Tkusintetika> Tkusintetika { get; set; } = null!;
        public virtual DbSet<UcesniciInventure> UcesniciInventure { get; set; } = null!;
        public virtual DbSet<IzvjestajTrgovackaKnjigaSintetika> IzvjestajTrgovackaKnjigaSintetika { get; set; } = null!;
        public virtual DbSet<IzvjestajTrgovackaKnjigaAnalitika> IzvjestajTrgovackaKnjigaAnalitika { get; set; } = null!;
        public virtual DbSet<PregledIzdatnica> PregledIzdatnica { get; set; } = null!;
        public virtual DbSet<PregledNeuslovneRobe> PregledNeuslovneRobe { get; set; } = null!;
        public virtual DbSet<PregledIzdatnicaInterna> PregledIzdatnicaInterna { get; set; } = null!;
        public virtual DbSet<NovaIzdatnica> NovaIzdatnica { get; set; } = null!;
        public virtual DbSet<IzvjestajIzdatnica> IzvjestajIzdatnica { get; set; } = null!;
        public virtual DbSet<PDTdokumenti> PDTdokumenti { get; set; } = null!;
        public virtual DbSet<PDTartikliVanrednogOtpisa> PDTartikliVanrednogOtpisa { get; set; } = null!;
        public virtual DbSet<PDTartikliRedovnogOtpisa> PDTartikliRedovnogOtpisa { get; set; } = null!;
        public virtual DbSet<PDTIzdatnicaTroska> PDTizdatniceTroska { get; set; } = null!;
        public virtual DbSet<PDTNeuslovnaRoba> PDTNeuslovnaRoba { get; set; } = null!;
        public virtual DbSet<PregledOtpisa> PregledOtpisa { get; set; } = null!;
        public virtual DbSet<PregledDinamike> PregledDinamike { get; set; } = null!;
        public virtual DbSet<PregledOtpisaInterna> PregledOtpisaInterna { get; set; } = null!;
        public virtual DbSet<PregledUcesnika> PregledUcesnika { get; set; } = null!;
        public virtual DbSet<NemaOtpisa> NemaOtpisa { get; set; } = null!;
        public virtual DbSet<DetaljiRedovnogOtpisa> DetaljiRedovnogOtpisa { get; set; } = null!;
        public virtual DbSet<ArtikliIzdatniceDetalji> ArtikliIzdatniceDetalji { get; set; } = null!;
        public virtual DbSet<ArtikliNeuslovneRobeDetalji> ArtikliNeuslovneRobeDetalji { get; set; } = null!;
        public virtual DbSet<DetaljiVanrednogOtpisa> DetaljiVanrednogOtpisa { get; set; } = null!;
        public virtual DbSet<ZahtjeviRedovniOtpis> ZahtjeviRedovniOtpis { get; set; } = null!;
        public virtual DbSet<ZahtjeviIzdatnice> ZahtjeviIzdatnice { get; set; } = null!;
        public virtual DbSet<ZahtjeviIzdatniceDetalji> ZahtjeviIzdatniceDetalji { get; set; } = null!;
        public virtual DbSet<ZahtjeviRedovniOtpisDetalji> ZahtjeviRedovniOtpisDetalji { get; set; } = null!;
        public virtual DbSet<UnosDatumaOtpisa> UnosDatumaOtpisa { get; set; } = null!;
        public virtual DbSet<ZahtjeviVanredniOtpis> ZahtjeviVanredniOtpis { get; set; } = null!;
        public virtual DbSet<ZahtjeviVanredniOtpisDetalji> ZahtjeviVanredniOtpisDetalji { get; set; } = null!;
        public virtual DbSet<KontrolneInventure> KontrolneInventure { get; set; } = null!;
        public virtual DbSet<DetaljiRedovnogOtpisaOdbijeno> DetaljiRedovnogOtpisaOdbijeno { get; set; } = null!;
        public virtual DbSet<DetaljiRedovnogOtpisaOdobreno> DetaljiRedovnogOtpisaOdobreno { get; set; } = null!;
        public virtual DbSet<DetaljiVanrednogOtpisaOdbijeno> DetaljiVanrednogOtpisaOdbijeno { get; set; } = null!;
        public virtual DbSet<DetaljiVanrednogOtpisaOdobreno> DetaljiVanrednogOtpisaOdobreno { get; set; } = null!;
        public virtual DbSet<ZavrseniRedovniZahtjevi> ZavrseniRedovniZahtjevi { get; set; } = null!;
        public virtual DbSet<ZavrseniVanredniZahtjevi> ZavrseniVanredniZahtjevi { get; set; } = null!;
        public virtual DbSet<ParcijalnaInventuraImportZaposlenika> ParcijalnaInventuraImportZaposlenika { get; set; } = null!;
        public virtual DbSet<ListaZaposlenikaParcijalneInventure> ListaZaposlenikaParcijalneInventure { get; set; } = null!;
        public virtual DbSet<ResponseZaposleniciParcijalneInventure> ResponseZaposleniciParcijalneInventure { get; set; } = null!;
        public virtual DbSet<ParcijalnaInventura> ParcijalnaInventura { get; set; } = null!;
        public virtual DbSet<GetPodaciReklamacije> GetPodaciReklamacije { get; set; } = null!;
        public virtual DbSet<VikendAkcijaStavkaDto> VikendAkcijaStavkaDto { get; set; } = null!;
        public virtual DbSet<ProdajniLayout> ProdajniLayout { get; set; } = null!;
        public virtual DbSet<ProdajnaPozicija> ProdajnaPozicija { get; set; } = null!;
        public virtual DbSet<ResponseParcijalneInventurePodrucni> ResponseParcijalneInventurePodrucni { get; set; } = null!;
        public virtual DbSet<ResponseParcijalneInventurePodrucniZaglavlje> ResponseParcijalneInventurePodrucniZaglavlje { get; set; } = null!;
        public virtual DbSet<ResponseParcijalneInventurePodrucniZaglavlje> ResponseParcijalneInventureInternaZaglavlje { get; set; } = null!;
        public virtual DbSet<IzvjestajParcijalnaInventuraInternaKontrola> IzvjestajParcijalnaInventuraInternaKontrola { get; set; } = null!;
        public virtual DbSet<IzvjestajPotpunihInventuraInterna> IzvjestajPotpunihInventuraInterna { get; set; } = null!;
        public virtual DbSet<ImenaUposlenikaNaInventuri> GetUposlenici { get; set; } = null!;
        public virtual DbSet<PodaciUposlenikaParcijalnaInv> GetPodaciUposlenikaParcijalnaInv { get; set; } = null!;
        public virtual DbSet<ResponseProdavniceParcijalnaInventuraNezavrseno> ResponseProdavniceParcijalnaInventuraNezavrseno { get; set; } = null!;
        public virtual DbSet<AkcijeZaglavljeResponse> AkcijeZaglavljeResponse { get; set; } = null!;
        public virtual DbSet<AkcijeStavkeResponse> AkcijeStavkeResponse { get; set; } = null!;
        public virtual DbSet<ResponsePrometProdavnice> PrometProdavnice { get; set; } = null!;
        public virtual DbSet<ResponsePrometiProdavnica> PrometiProdavnica { get; set; } = null!;
        public virtual DbSet<ResponsePrometiProdavnica> ResponsePrometiProdavnica { get; set; } = null!;
        public virtual DbSet<PrometHistorija> PrometiHistorija { get; set; } = null!;
        public virtual DbSet<NetoPovrsinaProd> NetoPovrsinaProd { get; set; } = null!;
        public virtual DbSet<ZaposleniPoProdavnici> ZaposleniPoProdavnicama { get; set; } = null!;
        public virtual DbSet<VipZaglavlje> VipZaglavljes { get; set; } = null!;
        public virtual DbSet<VipStavke> VipStavkes { get; set; } = null!;
        public virtual DbSet<VipArtikli> VipArtiklis { get; set; } = null!;
        public DbSet<KategorijaPrometResponse> PrometPoKategoriji { get; set; } = null!;
        public DbSet<ArtikliNaRacunuResponse> ArtikliNaRacunu { get; set; } = null!;
        public DbSet<NarucenoIsporucenoResponse> NarucenoIsporuceno { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            /*
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=L93834NEW;Database=Auro2;Trusted_Connection=True;");
            }
            */
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Artikal>(entity =>
            {
                entity.ToTable("Artikal");

                entity.Property(e => e.ArtikalId).HasColumnName("ArtikalID");

                entity.Property(e => e.Aktivnost).HasMaxLength(1);

                entity.Property(e => e.Barkod)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.Bl0)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("BL0");

                entity.Property(e => e.Cijena).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.DobavljacId).HasColumnName("DobavljacID");

                entity.Property(e => e.JedinicaMjere).HasMaxLength(25);

                entity.Property(e => e.Kal)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("KAL");

                entity.Property(e => e.KategorijaId).HasColumnName("KategorijaID");

                entity.Property(e => e.Merc)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("MERC");

                entity.Property(e => e.Mo0)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("MO0");

                entity.Property(e => e.NabavnaCijena).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Naziv).HasMaxLength(150);

                entity.Property(e => e.PodkategorijaId).HasColumnName("PodkategorijaID");

                entity.Property(e => e.Sa0)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("SA0");

                entity.Property(e => e.Sa4)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("SA4");

                entity.Property(e => e.Sifra)
                    .HasMaxLength(25)
                    .IsFixedLength();

                entity.Property(e => e.Tz0)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("TZ0");

                entity.Property(e => e.Vel)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("VEL");

                entity.Property(e => e.Zc1)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("ZC1");

                entity.Property(e => e.Zc6)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("ZC6");

                entity.Property(e => e.Zh0)
                    .HasColumnType("numeric(20, 4)")
                    .HasColumnName("ZH0");

                entity.HasOne(d => d.Dobavljac)
                    .WithMany(p => p.Artikals)
                    .HasForeignKey(d => d.DobavljacId)
                    .HasConstraintName("FK_Artikal_Dobavljac");
            });

            modelBuilder.Entity<ArtikalOvjeraOtpisa>(entity =>
            {
                entity.ToTable("ArtikalOvjeraOtpisa");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.DatumOvjere).HasColumnType("datetime");

                entity.Property(e => e.Komentar).HasMaxLength(500);

                entity.Property(e => e.MenadzerId).HasColumnName("MenadzerID");

                entity.Property(e => e.OtpisId).HasColumnName("OtpisID");

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.Property(e => e.StatusId).HasColumnName("StatusID");

                entity.HasOne(d => d.Menadzer)
                    .WithMany(p => p.ArtikalOvjeraOtpisas)
                    .HasForeignKey(d => d.MenadzerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArtikalOvjeraOtpisa_Menadzer");

                entity.HasOne(d => d.Otpis)
                    .WithMany(p => p.ArtikalOvjeraOtpisas)
                    .HasForeignKey(d => d.OtpisId)
                    .HasConstraintName("FK_ArtikalOvjeraOtpisa_Otpis");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany(p => p.ArtikalOvjeraOtpisas)
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArtikalOvjeraOtpisa_Prodavnica");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.ArtikalOvjeraOtpisas)
                    .HasForeignKey(d => d.StatusId)
                    .HasConstraintName("FK_ArtikalOvjeraOtpisa_Status");
            });

            modelBuilder.Entity<DatumOtpisa>(entity =>
            {
                entity.ToTable("DatumOtpisa");

                entity.Property(e => e.DatumDo).HasColumnType("datetime");

                entity.Property(e => e.DatumOd).HasColumnType("datetime");
            });

            modelBuilder.Entity<Dobavljac>(entity =>
            {
                entity.ToTable("Dobavljac");

                entity.Property(e => e.DobavljacId).HasColumnName("DobavljacID");

                entity.Property(e => e.Adresa).HasMaxLength(150);

                entity.Property(e => e.Aktivnost).HasMaxLength(1);

                entity.Property(e => e.Drzava)
                    .HasMaxLength(50)
                    .IsFixedLength();

                entity.Property(e => e.Grad)
                    .HasMaxLength(50)
                    .IsFixedLength();

                entity.Property(e => e.Kontakt)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.KontaktNaziv).HasMaxLength(50);

                entity.Property(e => e.Naziv).HasMaxLength(100);

                entity.Property(e => e.Sifra)
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<HijerarhijaOdobravanja>(entity =>
            {
                entity.HasKey(e => new { e.MenadzerId, e.ProdavnicaId });

                entity.ToTable("HijerarhijaOdobravanja");

                entity.Property(e => e.MenadzerId).HasColumnName("MenadzerID");

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.HasOne(d => d.Menadzer)
                    .WithMany(p => p.HijerarhijaOdobravanjas)
                    .HasForeignKey(d => d.MenadzerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HijerarhijaOdobravanja_Menadzer");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany(p => p.HijerarhijaOdobravanjas)
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HijerarhijaOdobravanja_Prodavnica");
            });

            modelBuilder.Entity<Inventura>(entity =>
            {
                entity.ToTable("Inventura");

                entity.Property(e => e.Broj)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Datum).HasColumnType("datetime");

                entity.Property(e => e.DatumUnosa).HasColumnType("datetime");

                entity.Property(e => e.InventurnaVrijednost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.KnjigovodstvenaVrijednost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany(p => p.Inventuras)
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Inventura_Prodavnica");
            });

            modelBuilder.Entity<Izdatnica>(entity =>
            {
                entity.ToTable("Izdatnica");

                entity.Property(e => e.ArtikalId).HasColumnName("ArtikalID");

                entity.Property(e => e.BrojIzdatnice)
                    .HasMaxLength(13)
                    .IsUnicode(false);

                entity.Property(e => e.DatumIzradeIzdatnice).HasColumnType("date");

                entity.Property(e => e.DatumKreiranja).HasColumnType("date");

                entity.Property(e => e.Kolicina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Komentar).HasMaxLength(500);

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.Property(e => e.Razlog).HasMaxLength(500);

                entity.Property(e => e.UkupnaVrijednost).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Artikal)
                    .WithMany(p => p.Izdatnicas)
                    .HasForeignKey(d => d.ArtikalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Izdatnica_Artikal");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany(p => p.Izdatnicas)
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Izdatnica_Prodavnica");
            });

            modelBuilder.Entity<Kategorija>(entity =>
            {
                entity.ToTable("Kategorija");
            });

            modelBuilder.Entity<Korisnik>(entity =>
            {
                entity.ToTable("Korisnik");

                entity.Property(e => e.KorisnikId).HasColumnName("KorisnikID");

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.KorisnickoIme).HasMaxLength(50);

                entity.Property(e => e.Lozinka).IsUnicode(false);

                entity.Property(e => e.Uloga).HasMaxLength(10);
            });

            modelBuilder.Entity<Menadzer>(entity =>
            {
                entity.HasKey(e => e.KorisnikId);

                entity.ToTable("Menadzer");

                entity.Property(e => e.KorisnikId)
                    .ValueGeneratedNever()
                    .HasColumnName("KorisnikID");

                entity.Property(e => e.Ime).HasMaxLength(25);

                entity.Property(e => e.NazivRadnogMjesta).HasMaxLength(500);

                entity.Property(e => e.Prezime).HasMaxLength(50);

                entity.HasOne(d => d.Korisnik)
                    .WithOne(p => p.Menadzer)
                    .HasForeignKey<Menadzer>(d => d.KorisnikId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Menadzer_Menadzer");
            });

            modelBuilder.Entity<NeuslovnaRoba>(entity =>
            {
                entity.ToTable("NeuslovnaRoba");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ArtikalId).HasColumnName("ArtikalID");

                entity.Property(e => e.BrojNeuslovneRobe)
                    .HasMaxLength(13)
                    .IsUnicode(false);

                entity.Property(e => e.DatumKreiranja).HasColumnType("datetime");

                entity.Property(e => e.Kolicina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Napomena).HasMaxLength(500);

                entity.Property(e => e.OtpisPovrat).HasMaxLength(150);

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.Property(e => e.RazlogNeuslovnosti).HasMaxLength(150);

                entity.Property(e => e.RazlogPrisustva).HasMaxLength(150);

                entity.Property(e => e.StatusId).HasColumnName("StatusID");

                entity.Property(e => e.UkupnaVrijednost).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Artikal)
                    .WithMany(p => p.NeuslovnaRobas)
                    .HasForeignKey(d => d.ArtikalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NeuslovnaRoba_Artikal");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany(p => p.NeuslovnaRobas)
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_NeuslovnaRoba_Prodavnica");

                entity.HasOne(d => d.Status)
                    .WithMany(p => p.NeuslovnaRobas)
                    .HasForeignKey(d => d.StatusId)
                    .HasConstraintName("FK_NeuslovnaRoba_Status");
            });

            modelBuilder.Entity<Otpis>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ArtikalId).HasColumnName("ArtikalID");

                entity.Property(e => e.BrojOtpisa).HasMaxLength(50);

                entity.Property(e => e.DatumIstekaRoka).HasColumnType("date");

                entity.Property(e => e.DatumKreiranja).HasColumnType("date");

                entity.Property(e => e.Kolicina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.KomentarVanrednogOtpisa).HasMaxLength(500);

                entity.Property(e => e.Napomena).HasMaxLength(500);

                entity.Property(e => e.PodnosiocId).HasColumnName("PodnosiocID");

                entity.Property(e => e.PotrebanTransport)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.PotrebnoZbrinjavanje)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.ProvedenoSnizenje)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RazlogOtpisa).HasMaxLength(500);

                entity.Property(e => e.TipOtpisaId).HasColumnName("TipOtpisaID");

                entity.Property(e => e.UkupnaVrijednost).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Artikal)
                    .WithMany(p => p.Otpis)
                    .HasForeignKey(d => d.ArtikalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Otpis_Artikal");

                entity.HasOne(d => d.Podnosioc)
                    .WithMany(p => p.Otpis)
                    .HasForeignKey(d => d.PodnosiocId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Otpis_Korisnik");

                entity.HasOne(d => d.TipOtpisa)
                    .WithMany(p => p.Otpis)
                    .HasForeignKey(d => d.TipOtpisaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Otpis_TipOtpisa");
            });

            modelBuilder.Entity<tbl_ReklamacijeKvaliteta >(entity =>
            {
                entity.HasKey(e => e.SifraArtikla);

                entity.Property(e => e.SifraArtikla)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("SifraArtikla");

                entity.Property(e => e.Naziv)
                    .HasMaxLength(200)
                    .IsUnicode(true);

                entity.Property(e => e.Razlog)
                    .HasMaxLength(500)
                    .IsUnicode(true);

                entity.Property(e => e.JedinicaMjere)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Komentar)
                    .HasMaxLength(500)
                    .IsUnicode(true);                
                    
                entity.Property(e => e.Lot)
                    .HasMaxLength(50)
                    .IsUnicode(true);

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Kolicina)
                    .HasColumnType("int");

                entity.Property(e => e.ReklamiranaKolicina)
                    .HasColumnType("int");              
                    
                entity.Property(e => e.BrojZaduzenjaMLP)
                    .HasMaxLength(50)
                    .IsUnicode(true);

                entity.Property(e => e.Datum)
                    .HasColumnType("date");                
                    
                entity.Property(e => e.DatumPrijema)
                    .HasColumnType("date");
            });


            modelBuilder.Entity<OvjeraOtpisa>(entity =>
            {
                entity.ToTable("OvjeraOtpisa");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.BrojOtpisa)
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.Datum).HasColumnType("datetime");

                entity.Property(e => e.Komentar).HasMaxLength(500);

                entity.Property(e => e.MenadzerId).HasColumnName("MenadzerID");

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.Property(e => e.StatusId).HasColumnName("StatusID");
            });

            modelBuilder.Entity<Podkategorija>(entity =>
            {
                entity.ToTable("Podkategorija");
            });

            modelBuilder.Entity<Prodavnica>(entity =>
            {
                entity.HasKey(e => e.KorisnikId);

                entity.ToTable("Prodavnica");

                entity.Property(e => e.KorisnikId)
                    .ValueGeneratedNever()
                    .HasColumnName("KorisnikID");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.MenadzerId).HasColumnName("MenadzerID");

                entity.Property(e => e.Mjesto)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.NazivCjenika)
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.HasOne(d => d.Korisnik)
                    .WithOne(p => p.Prodavnica)
                    .HasForeignKey<Prodavnica>(d => d.KorisnikId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Prodavnica_Korisnik");
            });

            modelBuilder.Entity<ProdavniceBezOtpisa>(entity =>
            {
                entity.HasKey(e => new { e.DatumUnosa, e.BrojProdavnice });

                entity.ToTable("ProdavniceBezOtpisa");

                entity.Property(e => e.DatumUnosa).HasColumnType("date");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(4)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Status>(entity =>
            {
                entity.ToTable("Status");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Naziv).HasMaxLength(150);
            });

            modelBuilder.Entity<TipOtpisa>(entity =>
            {
                entity.ToTable("TipOtpisa");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.TipOtpisa1)
                    .HasMaxLength(150)
                    .HasColumnName("TipOtpisa");
            });

            modelBuilder.Entity<Tkuanalitika>(entity =>
            {
                entity.ToTable("TKUANALITIKA");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Brojtransakcija).HasColumnName("BROJTRANSAKCIJA");

                entity.Property(e => e.Datum)
                    .HasColumnType("datetime")
                    .HasColumnName("DATUM");

                entity.Property(e => e.Distributer).HasColumnName("DISTRIBUTER");

                entity.Property(e => e.Pdv)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("PDV");

                entity.Property(e => e.Poreznaproviziju)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("POREZNAPROVIZIJU");

                entity.Property(e => e.Prodajabezpdv)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("PRODAJABEZPDV");

                entity.Property(e => e.Prodajasapdv)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("PRODAJASAPDV");

                entity.Property(e => e.Prodavnica).HasColumnName("PRODAVNICA");

                entity.Property(e => e.Provizija)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("PROVIZIJA");

                entity.Property(e => e.Ukupnosapdv)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("UKUPNOSAPDV");
            });

            modelBuilder.Entity<Tkusintetika>(entity =>
            {
                entity.HasKey(e => new { e.Komitent, e.Prodavnica, e.Datum })
                    .HasName("PK_dbo.TKUSINTETIKA");

                entity.ToTable("TKUSINTETIKA");

                entity.Property(e => e.Komitent)
                    .HasMaxLength(128)
                    .HasColumnName("KOMITENT")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Prodavnica)
                    .HasMaxLength(128)
                    .HasColumnName("PRODAVNICA");

                entity.Property(e => e.Datum)
                    .HasColumnType("datetime")
                    .HasColumnName("DATUM");

                entity.Property(e => e.Iznosnaknadesapdv).HasColumnName("IZNOSNAKNADESAPDV");

                entity.Property(e => e.Opis).HasColumnName("OPIS");

                entity.Property(e => e.Rbr).HasColumnName("RBR");
            });

            modelBuilder.Entity<UcesniciInventure>(entity =>
            {
                entity.ToTable("UcesniciInventure");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.BrojProdavniceUcesnika)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.Datum).HasColumnType("datetime");

                entity.Property(e => e.Ime).HasMaxLength(50);

                entity.Property(e => e.Prezime).HasMaxLength(100);

                entity.Property(e => e.RolaNaInventuri).HasMaxLength(50);

                entity.Property(e => e.VrijemePocetka).HasColumnType("datetime");

                entity.Property(e => e.VrijemeZavrsetka).HasColumnType("datetime");
            });

            modelBuilder.Entity<ParcijalnaInventuraImportZaposlenika>(entity =>
            {
                entity.ToTable("ParcijalnaInventuraImportZaposlenika");

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.BrojIzMaticneKnjige);
                entity.Property(e => e.Ime).HasMaxLength(50);
                entity.Property(e => e.Prezime).HasMaxLength(150);
                entity.Property(e => e.RadnoMjesto).HasMaxLength(150);
                entity.Property(e => e.OznakaOJ).HasMaxLength(25);
                entity.Property(e => e.NazivOJ).HasMaxLength(25);
                entity.Property(e => e.Entitet).HasMaxLength(25);
                entity.Property(e => e.PodrucniVoditelj).HasMaxLength(150);

            });

            modelBuilder.Entity<ParcijalnaInventura>(entity =>
            {
                entity.ToTable("ParcijalnaInventura");

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.IznosZaIsplatu);
                entity.Property(e => e.BrojSati);
                entity.Property(e => e.BrojDana);
                entity.Property(e => e.DatumInventure).HasMaxLength(15);
                entity.Property(e => e.PodrucniVoditelj).HasMaxLength(150);
                entity.Property(e => e.OrgJed).HasMaxLength(25);
                entity.Property(e => e.Ime).HasMaxLength(25);
                entity.Property(e => e.Prezime).HasMaxLength(50);
                entity.Property(e => e.BrojDokumenta).HasMaxLength(50);
                entity.Property(e => e.BrojIzDESa);
                entity.Property(e => e.Status).HasMaxLength(50);
            });

            modelBuilder.Entity<IzvjestajTrgovackaKnjigaAnalitika>(entity => entity.HasNoKey());

            modelBuilder.Entity<IzvjestajTrgovackaKnjigaSintetika>(entity =>
              entity.HasNoKey()
            );

            modelBuilder.Entity<PregledIzdatnica>(entity =>
              entity.HasNoKey()
            );

            modelBuilder.Entity<PregledNeuslovneRobe>(entity =>
              entity.HasNoKey()
            );           
            modelBuilder.Entity<ImenaUposlenikaNaInventuri>(entity =>
              entity.HasNoKey()

            );           
            
            modelBuilder.Entity<PodaciUposlenikaParcijalnaInv>(entity =>
              entity.HasNoKey()
            );

            modelBuilder.Entity<NovaIzdatnica>(entity =>
              entity.HasNoKey()
            );
            modelBuilder.Entity<NemaOtpisa>(entity =>
             entity.HasNoKey()
           );
            modelBuilder.Entity<IzvjestajIzdatnica>(entity =>
              entity.HasNoKey()
            );

            modelBuilder.Entity<PregledDinamike>(entity =>
             entity.HasNoKey()
           );

            modelBuilder.Entity<PDTdokumenti>(entity =>
                entity.HasNoKey()
            );               
            
            modelBuilder.Entity<GetPodaciReklamacije>(entity =>
                entity.HasNoKey()
            );            
            
            modelBuilder.Entity<DetaljiArtiklaReklamacija>(entity =>
                entity.HasNoKey()
            );            
            
            modelBuilder.Entity<VikendAkcijaStavkaDto>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PDTartikliVanrednogOtpisa>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PDTIzdatnicaTroska>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PregledUcesnika>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PDTartikliRedovnogOtpisa>(entity =>
                entity.HasNoKey()
            );
            modelBuilder.Entity<PDTNeuslovnaRoba>(entity =>
            entity.HasNoKey()
            );

            modelBuilder.Entity<PregledOtpisa>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PregledOtpisaInterna>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiRedovnogOtpisa>(entity =>
                entity.HasNoKey()
            );
            modelBuilder.Entity<ArtikliIzdatniceDetalji>(entity =>
                entity.HasNoKey()
            );
            modelBuilder.Entity<ArtikliNeuslovneRobeDetalji>(entity =>
                entity.HasNoKey()
            );           
             modelBuilder.Entity<UcesniciInventure>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiVanrednogOtpisa>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ZahtjeviRedovniOtpis>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ZahtjeviRedovniOtpisDetalji>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<PregledIzdatnicaInterna>(entity =>
            entity.HasNoKey()
            );

            modelBuilder.Entity<UnosDatumaOtpisa>(entity =>
            entity.HasNoKey()
            );

            modelBuilder.Entity<ZahtjeviVanredniOtpis>(entity =>
                entity.HasNoKey()
            );
            modelBuilder.Entity<ZahtjeviIzdatnice>(entity =>
               entity.HasNoKey()
           );

            modelBuilder.Entity<ZahtjeviVanredniOtpisDetalji>(entity =>
                entity.HasNoKey()
            );
            modelBuilder.Entity<ZahtjeviIzdatniceDetalji>(entity =>
              entity.HasNoKey()
          );

            modelBuilder.Entity<KontrolneInventure>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiRedovnogOtpisaOdbijeno>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiRedovnogOtpisaOdobreno>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiVanrednogOtpisaOdbijeno>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DetaljiVanrednogOtpisaOdobreno>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ArtikliIzdatniceDetalji>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ZavrseniRedovniZahtjevi>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ZavrseniVanredniZahtjevi>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<Statistika>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ListaZaposlenikaParcijalneInventure>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ResponseZaposleniciParcijalneInventure>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<RequestParcijalneInventure>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<RequestParcijalneInventureZaposlenik>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<DailyTaskTemplate>(entity =>
            {
                entity.ToTable("DailyTaskTemplate");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.DefaultStatus)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsActive)
                    .HasDefaultValue(true);

                entity.HasData(
                    new DailyTaskTemplate
                    {
                        Id = 1,
                        Title = "Naručivanje robe za market",
                        Description = "Provjeriti zalihe i naručiti potrebnu robu za market.",
                        ImageAllowed = false,
                        IsActive = true,
                        DefaultStatus = "OPEN"
                    },
                    new DailyTaskTemplate
                    {
                        Id = 2,
                        Title = "Provjera cijena",
                        Description = "Provjeriti da li su cijene na policama usklađene sa sistemom.",
                        ImageAllowed = true,
                        IsActive = true,
                        DefaultStatus = "OPEN"
                    },
                    new DailyTaskTemplate
                    {
                        Id = 3,
                        Title = "Narudžba za VIP odjel do 10 sati",
                        Description = "Osigurati da su sve narudžbe za VIP odjel završene do 10 sati.",
                        ImageAllowed = false,
                        IsActive = true,
                        DefaultStatus = "OPEN"
                    },
                    new DailyTaskTemplate
                    {
                        Id = 4,
                        Title = "Provjera funkcionalnosti uređaja u marketu",
                        Description = "Provjeriti sve uređaje u marketu i evidentirati eventualne kvarove.",
                        ImageAllowed = true,
                        IsActive = true,
                        DefaultStatus = "OPEN"
                    }
                );
            });

            modelBuilder.Entity<DailyTask>(entity =>
            {
                entity.ToTable("DailyTask");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Date)
                    .HasColumnType("date");

                entity.Property(e => e.ImageAttachment)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.CompletionNote)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany()
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK_DailyTask_CreatedBy");

                entity.HasOne(d => d.CompletedBy)
                    .WithMany()
                    .HasForeignKey(d => d.CompletedById)
                    .HasConstraintName("FK_DailyTask_CompletedBy");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany()
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DailyTask_Prodavnica");

                entity.HasOne(d => d.Template)
                    .WithMany(p => p.DailyTasks)
                    .HasForeignKey(d => d.TemplateId)
                    .HasConstraintName("FK_DailyTask_Template");
            });

            modelBuilder.Entity<ProdajniLayout>(entity =>
            {
                entity.ToTable("ProdajniLayout");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ProdavnicaId).HasColumnName("ProdavnicaID");

                entity.Property(e => e.Sirina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Duzina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BackgroundFileName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.BackgroundContentType)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.BackgroundData).HasColumnType("nvarchar(max)");

                entity.Property(e => e.DatumKreiranja).HasColumnType("datetime");

                entity.Property(e => e.DatumIzmjene).HasColumnType("datetime");

                entity.HasOne(d => d.Prodavnica)
                    .WithMany()
                    .HasForeignKey(d => d.ProdavnicaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProdajniLayout_Prodavnica");
            });

            modelBuilder.Entity<ProdajnaPozicija>(entity =>
            {
                entity.ToTable("ProdajnaPozicija");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.LayoutId).HasColumnName("LayoutID");

                entity.Property(e => e.Tip)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Naziv)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.BrojPozicije)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Trgovac)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ZakupDo).HasColumnType("datetime");

                entity.Property(e => e.VrijednostZakupa).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.VrstaUgovora)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.TipPozicije)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Sirina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Duzina).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PozicijaX).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PozicijaY).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Rotacija).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Zona)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.DatumKreiranja).HasColumnType("datetime");

                entity.Property(e => e.DatumIzmjene).HasColumnType("datetime");

                entity.HasOne(d => d.Layout)
                    .WithMany(p => p.Pozicije)
                    .HasForeignKey(d => d.LayoutId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ProdajnaPozicija_ProdajniLayout");
            });

            modelBuilder.Entity<ResponseParcijalneInventurePodrucni>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ResponseParcijalneInventurePodrucniZaglavlje>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<IzvjestajParcijalnaInventuraInternaKontrola>(entity =>
                {
                    entity.HasNoKey(); 
                    
                });            
                
            modelBuilder.Entity<IzvjestajPotpunihInventuraInterna>(entity =>
                {
                    entity.HasNoKey(); 
                    
                });

            modelBuilder.Entity<ResponseProdavniceParcijalnaInventuraNezavrseno>(entity =>
                entity.HasNoKey()
            );

            
            modelBuilder.Entity<AkcijeZaglavljeResponse>(entity =>
                entity.HasNoKey()

                
            );            modelBuilder.Entity<ResponsePrometiProdavnica>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<AkcijeStavkeResponse>(entity =>
                entity.HasNoKey()
            );


            modelBuilder.Entity<ResponsePrometProdavnice>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<ResponsePrometiProdavnica>(entity =>
                entity.HasNoKey()
            );

            modelBuilder.Entity<NetoPovrsinaProd>(entity =>
            {
                entity.HasNoKey();
                entity.ToTable("NetoPovrsinaProd");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.NetoPovrsina).HasColumnType("float");
            });

            modelBuilder.Entity<ZaposleniPoProdavnici>(entity =>
            {
                entity.HasNoKey();
                entity.ToTable("ZaposleniPoProdavnicama");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(4)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VipZaglavlje>(entity =>
            {
                entity.ToTable("VIPZaglavlje");

                entity.Property(e => e.Id).HasColumnName("Id");

                entity.Property(e => e.Kraj)
                    .HasColumnType("datetime");

                entity.Property(e => e.Opis)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Pocetak)
                    .HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.UniqueId)
                    .HasColumnType("nvarchar(64)");

                entity.Property(e => e.Produzeno)
                    .HasColumnType("bit")
                    .HasDefaultValue(false);
            });

            modelBuilder.Entity<VipStavke>(entity =>
            {
                entity.ToTable("VIPStavkes");

                entity.Property(e => e.Id).HasColumnName("Id");

                entity.Property(e => e.Kolicina)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.NazivArtikla)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Prodavnica)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.SifraArtikla)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.VipZaglavljeId)
                    .HasColumnName("VIPZaglavlje_Id");

                entity.Property(e => e.VrijemeUnosaIzProdavnice)
                    .HasColumnType("datetime");

                entity.Property(e => e.VrijemeUnosaSaSourcea)
                    .HasColumnType("datetime");

                entity.Property(e => e.Komentar)
                    .HasColumnType("nvarchar(50)");

                entity.HasOne(d => d.VipZaglavlje)
                    .WithMany(p => p.VipStavkes)
                    .HasForeignKey(d => d.VipZaglavljeId)
                    .HasConstraintName("FK_dbo.VIPStavkes_dbo.VIPZaglavlje_VIPZaglavlje_Id");
            });

            modelBuilder.Entity<VipArtikli>(entity =>
            {
                entity.ToTable("VIPArtikli");

                entity.Property(e => e.Id).HasColumnName("Id");

                entity.Property(e => e.Idakcije)
                    .HasColumnName("IDAkcije")
                    .HasColumnType("nvarchar(64)");

                entity.Property(e => e.NazivArtk)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.SifraArtk)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.BarKod)
                    .HasColumnType("nvarchar(128)");

                entity.Property(e => e.Dobavljac)
                    .HasColumnType("nvarchar(256)");

                entity.Property(e => e.AsSa)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.AsMo)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.AsBl)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Opis)
                    .HasColumnType("nvarchar(max)");

                entity.Property(e => e.Status)
                    .HasColumnType("nvarchar(128)");

                entity.Property(e => e.AkcijskaMpc)
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Zaliha)
                    .HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<PrometHistorija>(entity =>
            {
                entity.ToTable("PrometiHistorija");

                entity.HasKey(e => e.PrometId);

                entity.Property(e => e.PrometId)
                    .HasColumnName("PrometID");

                entity.Property(e => e.BrojProdavnice)
                    .HasMaxLength(50);

                entity.Property(e => e.Datum)
                    .HasColumnType("date");

                entity.Property(e => e.DatumUnosa)
                    .HasColumnType("datetime");

                entity.Property(e => e.UkupniPromet)
                    .HasColumnType("decimal(18, 2)");

            });

            modelBuilder.Entity<KategorijaPrometResponse>().HasNoKey();
            modelBuilder.Entity<ArtikliNaRacunuResponse>().HasNoKey();
            modelBuilder.Entity<NarucenoIsporucenoResponse>(entity =>
                entity.HasNoKey()
            );

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
