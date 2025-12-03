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
  privatneKolicine = new Map<string, number>();
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
          this.stavke = this.filtrirajStavkePoProdavnici(podaci);
          this.privatneKolicine = new Map(this.stavke.map(s => [s.id, s.kolicina]));
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
    return this.privatneKolicine.get(stavka.id) !== stavka.kolicina;
  }

  pripremiIzmjene(): VikendAkcijaStavkaUpdate[] {
    return this.stavke
      .filter(stavka => this.kolicinaPromijenjena(stavka))
      .map(stavka => ({
        id: stavka.id,
        vikendAkcijaId: this.vikendAkcijaId,
        sifraArtikla: stavka.sifra ?? '',
        nazivArtikla: stavka.naziv ?? '',
        kolicina: Number(stavka.kolicina),
        brojProdavnice: this.brojProdavnice,
      }));
  }

  mozeUrediti(): boolean {
    return this.rola === 'uprava' || this.rola === 'prodavnica';
  }

  mozeSpasiti(): boolean {
    return this.mozeUrediti() && !!this.brojProdavnice && this.pripremiIzmjene().length > 0 && !this.saving;
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
          izmjene.forEach(izmjena => this.privatneKolicine.set(izmjena.id, izmjena.kolicina));
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

  private filtrirajStavkePoProdavnici(stavke: VikendAkcijaStavka[]): VikendAkcijaStavka[] {
    if (this.rola !== 'prodavnica' || !this.brojProdavnice) {
      return stavke;
    }

    return stavke.filter(stavka => (stavka.prodavnica ?? '').toString() === this.brojProdavnice);
  }
}
