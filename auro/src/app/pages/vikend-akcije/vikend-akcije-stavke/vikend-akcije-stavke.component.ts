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
  @Input() vikendAkcijaId!: number;
  @Input() naslov = '';
  @Input() rola = '';

  stavke: VikendAkcijaStavka[] = [];
  privatneKolicine = new Map<number, number>();
  loading = false;
  saving = false;
  greska = '';

  constructor(
    protected dialogRef: NbDialogRef<VikendAkcijeStavkeComponent>,
    private readonly dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.ucitajStavke();
  }

  ucitajStavke(): void {
    this.loading = true;
    this.greska = '';
    this.dataService.preuzmiStavkeVikendAkcije(this.vikendAkcijaId)
      .subscribe({
        next: (podaci) => {
          this.stavke = podaci;
          this.privatneKolicine = new Map(podaci.map(s => [s.id, s.kolicina]));
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
      .map(stavka => ({ id: stavka.id, kolicina: Number(stavka.kolicina) }));
  }

  mozeSpasiti(): boolean {
    return this.rola === 'uprava' && this.pripremiIzmjene().length > 0 && !this.saving;
  }

  sacuvaj(): void {
    const izmjene = this.pripremiIzmjene();
    if (!izmjene.length) {
      this.zatvori(false);
      return;
    }
    this.saving = true;
    this.greska = '';
    this.dataService.azurirajStavkeVikendAkcije(this.vikendAkcijaId, izmjene)
      .subscribe({
        next: () => {
          this.saving = false;
          this.zatvori(true);
        },
        error: (err) => {
          this.greska = err.error?.poruka ?? 'Greška prilikom čuvanja izmjena.';
          this.saving = false;
        }
      });
  }
}
