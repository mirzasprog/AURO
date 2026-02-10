import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ProdajnaPozicija, ProdajniLayout } from '../../../@core/data/prodajne-pozicije';

@Component({
  selector: 'ngx-dodaj-poziciju-modal',
  templateUrl: './dodaj-poziciju-modal.component.html',
  styleUrls: ['./dodaj-poziciju-modal.component.scss']
})
export class DodajPozicijuModalComponent implements OnInit {
  @Input() layout!: ProdajniLayout;
  @Input() postojecePozicije: ProdajnaPozicija[] = [];
  @Input() editMode = false; // NOVO: Da li je edit ili dodavanje
  @Input() pozicijaZaEdit?: ProdajnaPozicija; // NOVO: Pozicija koja se edituje

  novaPozicija: Partial<ProdajnaPozicija> = {
    pozicijaX: 0,
    pozicijaY: 0,
    sirina: 1,
    duzina: 1,
    rotacija: 0,
    tip: 'Regal',
    brojPozicije: '',
    naziv: '',
    zona: '',
    trgovac: '',
    trader: '',
    nazivArtikla: '',
    zakupDo: '',
    vrijednostZakupa: 0,
    vrstaUgovora: '',
    tipPozicije: ''
  };

  tipovi = [
    'Regal',
    'Frižider',
    'Zamrzivač',
    'Pult',
    'Vitrina',
    'Korpa',
    'Stalak',
    'Ostalo'
  ];

  odjeli = [
    'Pakirana',
    'Svježa',
    'Neprehrana 1',
    'Neprehrana 2',
    'Delikates',
    'Gastro',
    'Piće i grickalice',
    'Voće i povrće',
    'Mesnica',
    'Cigarete i duhanski proizvodi',
    'Neprehrana svježa',
    'Neprehrana prehrana',
    'Neprehrana prehrana svježa',
    'Prehrana svježa'
  ];

  validationErrors: { [key: string]: string } = {};

  constructor(protected dialogRef: NbDialogRef<DodajPozicijuModalComponent>) {}

  ngOnInit(): void {
    if (this.editMode && this.pozicijaZaEdit) {
      // EDIT MODE: Popuni formu sa podacima postojeće pozicije
      this.novaPozicija = { ...this.pozicijaZaEdit };
    } else {
      // ADD MODE: Automatski generiši broj pozicije
      this.generisBrojPozicije();
    }
  }

  generisBrojPozicije(): void {
    const postojeciBrojevi = this.postojecePozicije
      .map(p => p.brojPozicije || '')
      .filter(b => b.match(/^P-\d+$/))
      .map(b => parseInt(b.replace('P-', ''), 10))
      .filter(n => !isNaN(n));

    const maxBroj = postojeciBrojevi.length > 0 ? Math.max(...postojeciBrojevi) : 0;
    this.novaPozicija.brojPozicije = `P-${(maxBroj + 1).toString().padStart(3, '0')}`;
  }

  validate(): boolean {
    this.validationErrors = {};

    if (!this.novaPozicija.brojPozicije?.trim()) {
      this.validationErrors['brojPozicije'] = 'Broj pozicije je obavezan';
    }

    if (!this.novaPozicija.tip?.trim()) {
      this.validationErrors['tip'] = 'Tip pozicije je obavezan';
    }

    if (!this.novaPozicija.sirina || this.novaPozicija.sirina <= 0) {
      this.validationErrors['sirina'] = 'Širina mora biti veća od 0';
    }

    if (!this.novaPozicija.duzina || this.novaPozicija.duzina <= 0) {
      this.validationErrors['duzina'] = 'Dužina mora biti veća od 0';
    }

    if (this.novaPozicija.pozicijaX! < 0 || this.novaPozicija.pozicijaX! >= this.layout.sirina) {
      this.validationErrors['pozicijaX'] = `X pozicija mora biti između 0 i ${this.layout.sirina - 1}`;
    }

    if (this.novaPozicija.pozicijaY! < 0 || this.novaPozicija.pozicijaY! >= this.layout.duzina) {
      this.validationErrors['pozicijaY'] = `Y pozicija mora biti između 0 i ${this.layout.duzina - 1}`;
    }

    // Provjeri da li pozicija prelazi granice layouta
    if (this.novaPozicija.pozicijaX! + this.novaPozicija.sirina! > this.layout.sirina) {
      this.validationErrors['sirina'] = 'Pozicija prelazi desnu granicu layouta';
    }

    if (this.novaPozicija.pozicijaY! + this.novaPozicija.duzina! > this.layout.duzina) {
      this.validationErrors['duzina'] = 'Pozicija prelazi donju granicu layouta';
    }

    // Provjeri preklapanje sa postojećim pozicijama
    const preklapanje = this.postojecePozicije.some(p => {
      return !(
        this.novaPozicija.pozicijaX! + this.novaPozicija.sirina! <= p.pozicijaX ||
        this.novaPozicija.pozicijaX! >= p.pozicijaX + p.sirina ||
        this.novaPozicija.pozicijaY! + this.novaPozicija.duzina! <= p.pozicijaY ||
        this.novaPozicija.pozicijaY! >= p.pozicijaY + p.duzina
      );
    });

    if (preklapanje) {
      this.validationErrors['position'] = 'Pozicija se preklapa sa postojećom pozicijom';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  sacuvaj(): void {
    if (!this.validate()) {
      return;
    }

    const kompletanaPozicija: ProdajnaPozicija = {
      id: this.editMode && this.pozicijaZaEdit?.id ? this.pozicijaZaEdit.id : undefined, // Zadrži ID ako editujemo
      pozicijaX: this.novaPozicija.pozicijaX!,
      pozicijaY: this.novaPozicija.pozicijaY!,
      sirina: this.novaPozicija.sirina!,
      duzina: this.novaPozicija.duzina!,
      rotacija: this.novaPozicija.rotacija || 0,
      tip: this.novaPozicija.tip!,
      naziv: this.novaPozicija.naziv || '',
      brojPozicije: this.novaPozicija.brojPozicije || '',
      zona: this.novaPozicija.zona || null,
      trgovac: this.novaPozicija.trgovac || null,
      trader: this.novaPozicija.trader || null,
      nazivArtikla: this.novaPozicija.nazivArtikla || null,
      zakupDo: this.novaPozicija.zakupDo || null,
      vrijednostZakupa: this.novaPozicija.vrijednostZakupa || null,
      vrstaUgovora: this.novaPozicija.vrstaUgovora || null,
      tipPozicije: this.novaPozicija.tipPozicije || null
    };

    this.dialogRef.close(kompletanaPozicija);
  }

  odustani(): void {
    this.dialogRef.close(null);
  }

  // Getter za naslov modala
  get modalTitle(): string {
    return this.editMode ? 'Edituj poziciju' : 'Dodaj novu poziciju';
  }

  get modalDescription(): string {
    return this.editMode ? 'Izmijenite podatke o prodajnoj poziciji' : 'Unesite podatke o novoj prodajnoj poziciji';
  }

  get saveButtonText(): string {
    return this.editMode ? 'Sačuvaj izmjene' : 'Sačuvaj poziciju';
  }
}