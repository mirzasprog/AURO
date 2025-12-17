import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { VikendAkcijaStavka, VikendAkcijaStavkaUpdate } from '../../../@core/data/vikend-akcija-stavka';
import { DataService } from '../../../@core/utils/data.service';

@Component({
  selector: 'ngx-vikend-akcije-stavke',
  templateUrl: './vikend-akcije-stavke.component.html',
  styleUrls: ['./vikend-akcije-stavke.component.scss']
})
export class VikendAkcijeStavkeComponent implements OnInit {
  @Input() vikendAkcijaId!: string;
  @Input() naslov = '';
  @Input() rola = '';
  @Input() brojProdavnice = '';

  stavke: VikendAkcijaStavka[] = [];
  sveStavke: VikendAkcijaStavka[] = [];
  dostupneProdavnice: string[] = [];
  aktivnaProdavnica = '';
  originalneKolicine = new Map<string, number>();
  privatneKolicine = new Map<string, number>();
  filtriraneStavke: VikendAkcijaStavka[] = [];
  searchTerm = '';
  filterStatus: 'sve' | 'naručeno' | 'nenaručeno' = 'sve';
  trenutnaStranica = 1;
  readonly pageSize = 5;
  loading = false;
  saving = false;
  greska = '';
  uspjeh = '';

  constructor(
    protected dialogRef: NbDialogRef<VikendAkcijeStavkeComponent>,
    private readonly dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.ucitajStavke();
  }

  ucitajStavke(ocistiPoruke: boolean = true): void {
    this.loading = true;
    this.greska = '';
    if (ocistiPoruke) {
      this.uspjeh = '';
    }
    this.dataService.preuzmiStavkeVikendAkcije(this.vikendAkcijaId)
      .subscribe({
        next: (podaci) => {
          this.sveStavke = podaci.map(stavka => ({
            ...stavka,
            zaliha: stavka.zaliha ?? 0
          }));

          this.dostupneProdavnice = this.izdvojiProdavnice(this.sveStavke);
          this.originalneKolicine = this.kreirajKolicineMapu(this.sveStavke);
          this.aktivnaProdavnica = this.pocetnaProdavnica();
          this.osvjeziPrikazZaProdavnicu();
          this.loading = false;
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška prilikom učitavanja stavki.';
          this.loading = false;
        }
      });
  }

  zatvori(izmjena: boolean = false): void {
    this.dialogRef.close(izmjena);
  }

  kolicinaPromijenjena(stavka: VikendAkcijaStavka): boolean {
    const kljuc = this.kolicinaKljuc(stavka, this.trenutnaProdavnica());
    return (this.privatneKolicine.get(kljuc) ?? 0) !== Number(stavka.kolicina);
  }

  pripremiIzmjene(): VikendAkcijaStavkaUpdate[] {
    const prodavnica = this.trenutnaProdavnica();
    return this.stavke
      .filter(stavka => this.kolicinaPromijenjena(stavka))
      .map(stavka => ({
        id: stavka.id,
        vikendAkcijaId: this.vikendAkcijaId,
        sifraArtikla: stavka.sifra ?? '',
        nazivArtikla: stavka.naziv ?? '',
        kolicina: Number(stavka.kolicina),
        brojProdavnice: prodavnica,
      }));
  }

  mozeUrediti(): boolean {
    return this.rola === 'uprava' || this.rola === 'prodavnica';
  }

  mozeSpasiti(): boolean {
    return this.mozeUrediti()
      && !!this.trenutnaProdavnica()
      && this.pripremiIzmjene().length > 0
      && !this.saving;
  }

  sacuvaj(): void {
    const izmjene = this.pripremiIzmjene();
    if (!izmjene.length) {
      this.zatvori(false);
      return;
    }
    this.saving = true;
    this.greska = '';
    this.uspjeh = '';
    this.dataService.azurirajStavkeVikendAkcije(this.vikendAkcijaId, izmjene)
      .subscribe({
        next: (odgovor) => {
          izmjene.forEach(izmjena => {
            const kljuc = this.kolicinaKljuc({ ...izmjena, prodavnica: izmjena.brojProdavnice } as any, izmjena.brojProdavnice);
            this.privatneKolicine.set(kljuc, izmjena.kolicina);
            this.originalneKolicine.set(kljuc, izmjena.kolicina);
          });
          this.uspjeh = odgovor?.poruka ?? 'Stavke su uspješno spremljene.';
          this.greska = '';
          this.saving = false;
          this.ucitajStavke(false);
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška prilikom snimanja stavki.';
          this.saving = false;
        }
      });
  }

  promijeniProdavnicu(): void {
    if (!this.mozeUrediti() || this.rola === 'prodavnica') {
      return;
    }
    this.aktivnaProdavnica = (this.aktivnaProdavnica ?? '').trim();
    if (this.aktivnaProdavnica && !this.dostupneProdavnice.includes(this.aktivnaProdavnica)) {
      this.dostupneProdavnice = [...this.dostupneProdavnice, this.aktivnaProdavnica].sort();
    }
    this.osvjeziPrikazZaProdavnicu();
  }

  private osvjeziPrikazZaProdavnicu(): void {
    const prodavnica = this.trenutnaProdavnica();
    this.stavke = this.pripremiStavkePoProdavnici(this.sveStavke, prodavnica);
    this.privatneKolicine = new Map(
      this.stavke.map(stavka => {
        const kljuc = this.kolicinaKljuc(stavka, prodavnica);
        const vrijednost = this.originalneKolicine.get(kljuc) ?? 0;
        return [kljuc, vrijednost];
      })
    );
    this.primijeniFiltre();
  }

  promijeniFiltre(): void {
    this.trenutnaStranica = 1;
    this.primijeniFiltre();
  }

  promijeniStranicu(korak: number): void {
    const novaStranica = this.trenutnaStranica + korak;
    if (novaStranica < 1 || novaStranica > this.ukupnoStranica) {
      return;
    }
    this.trenutnaStranica = novaStranica;
  }

  get prikazaneStavke(): VikendAkcijaStavka[] {
    const pocetak = (this.trenutnaStranica - 1) * this.pageSize;
    return this.filtriraneStavke.slice(pocetak, pocetak + this.pageSize);
  }

  get ukupnoStranica(): number {
    return Math.max(1, Math.ceil(this.filtriraneStavke.length / this.pageSize) || 1);
  }

  private pripremiStavkePoProdavnici(stavke: VikendAkcijaStavka[], prodavnica: string): VikendAkcijaStavka[] {
    if (!stavke.length) {
      return [];
    }

    const bazaPoArtiklu = new Map<string, VikendAkcijaStavka>();

    stavke.forEach(stavka => {
      const kljuc = this.artikalKljuc(stavka);
      if (!bazaPoArtiklu.has(kljuc)) {
        bazaPoArtiklu.set(kljuc, {
          ...stavka,
          prodavnica,
          kolicina: 0,
          zaliha: stavka.zaliha ?? 0
        });
      }
    });

    const rezultat = new Map<string, VikendAkcijaStavka>();

    stavke.forEach(stavka => {
      const kljuc = this.artikalKljuc(stavka);
      const bazna = bazaPoArtiklu.get(kljuc)!;

      if ((stavka.prodavnica ?? '').toString() === prodavnica.toString()) {
        rezultat.set(kljuc, {
          ...bazna,
          ...stavka,
          prodavnica,
          kolicina: Number(stavka.kolicina) || 0,
          zaliha: stavka.zaliha ?? bazna.zaliha ?? 0
        });
        return;
      }

      if (!rezultat.has(kljuc)) {
        rezultat.set(kljuc, bazna);
      }
    });

    return Array.from(rezultat.values())
      .sort((a, b) => (a.sifra ?? '').localeCompare(b.sifra ?? ''));
  }

  private izdvojiProdavnice(stavke: VikendAkcijaStavka[]): string[] {
    const set = new Set<string>();
    stavke
      .map(s => (s.prodavnica ?? '').toString().trim())
      .filter(p => !!p)
      .forEach(p => set.add(p));
    return Array.from(set).sort();
  }

  private kreirajKolicineMapu(stavke: VikendAkcijaStavka[]): Map<string, number> {
    const mapa = new Map<string, number>();
    stavke.forEach(stavka => {
      const kljuc = this.kolicinaKljuc(stavka, stavka.prodavnica ?? this.trenutnaProdavnica());
      mapa.set(kljuc, Number(stavka.kolicina) || 0);
    });
    return mapa;
  }

  private pocetnaProdavnica(): string {
    if (this.rola === 'prodavnica') {
      return this.brojProdavnice;
    }

    if (this.aktivnaProdavnica) {
      return this.aktivnaProdavnica;
    }

    return this.dostupneProdavnice[0] ?? '';
  }

  private trenutnaProdavnica(): string {
    return this.rola === 'prodavnica' ? this.brojProdavnice : this.aktivnaProdavnica;
  }

  private artikalKljuc(stavka: VikendAkcijaStavka): string {
    return (stavka.sifra ?? stavka.naziv ?? stavka.id ?? '').toString().trim().toLowerCase();
  }

  private kolicinaKljuc(stavka: VikendAkcijaStavka, prodavnica?: string): string {
    const oznaka = prodavnica ?? stavka.prodavnica ?? '';
    return `${this.artikalKljuc(stavka)}|${oznaka.toString().trim()}`;
  }

  private primijeniFiltre(): void {
    const trazeniTekst = this.searchTerm.trim().toLowerCase();
    this.filtriraneStavke = this.stavke.filter(stavka => {
      const kolicina = Number(stavka.kolicina) || 0;
      const zadovoljavaStatus = this.filterStatus === 'sve'
        || (this.filterStatus === 'naručeno' && kolicina > 0)
        || (this.filterStatus === 'nenaručeno' && kolicina === 0);

      if (!zadovoljavaStatus) {
        return false;
      }

      if (!trazeniTekst) {
        return true;
      }

      const sifra = (stavka.sifra ?? '').toString().toLowerCase();
      const naziv = (stavka.naziv ?? '').toString().toLowerCase();
      const opis = (stavka.opis ?? '').toString().toLowerCase();
      return sifra.includes(trazeniTekst) || naziv.includes(trazeniTekst) || opis.includes(trazeniTekst);
    });

    const ukupno = this.ukupnoStranica;
    if (this.trenutnaStranica > ukupno) {
      this.trenutnaStranica = ukupno;
    }
  }
}
