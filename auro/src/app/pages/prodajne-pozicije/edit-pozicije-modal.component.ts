import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProdajnaPozicija } from '../../@core/data/prodajne-pozicije';

@Component({
  selector: 'ngx-edit-pozicija-modal',
  template: `
    <nb-card>
      <nb-card-header>Izmena pozicije</nb-card-header>
      <nb-card-body>
        <form (ngSubmit)="sacuvaj()">
          <div class="form-group">
            <label for="naziv">Naziv</label>
            <input nbInput id="naziv" name="naziv" [(ngModel)]="tempPozicija.naziv" required />
          </div>
          <div class="form-group">
            <label for="brojPozicije">Broj pozicije</label>
            <input nbInput id="brojPozicije" name="brojPozicije" [(ngModel)]="tempPozicija.brojPozicije" />
          </div>
          <div class="form-group">
            <label for="tip">Tip</label>
            <input nbInput id="tip" name="tip" [(ngModel)]="tempPozicija.tip" />
          </div>
          <div class="form-group">
            <label for="pozicijaX">X Pozicija (m)</label>
            <input nbInput type="number" id="pozicijaX" [(ngModel)]="tempPozicija.pozicijaX" name="pozicijaX" required step="0.01"/>
          </div>
          <div class="form-group">
            <label for="pozicijaY">Y Pozicija (m)</label>
            <input nbInput type="number" id="pozicijaY" [(ngModel)]="tempPozicija.pozicijaY" name="pozicijaY" required step="0.01"/>
          </div>
          <div class="form-group">
            <label for="sirina">Širina (m)</label>
            <input nbInput type="number" id="sirina" name="sirina" [(ngModel)]="tempPozicija.sirina" required step="0.01"/>
          </div>
          <div class="form-group">
            <label for="duzina">Dužina (m)</label>
            <input nbInput type="number" id="duzina" name="duzina" [(ngModel)]="tempPozicija.duzina" required step="0.01"/>
          </div>
          <div class="form-group">
            <label for="rotacija">Rotacija (stepeni)</label>
            <input nbInput type="number" id="rotacija" name="rotacija" [(ngModel)]="tempPozicija.rotacija" required step="1"/>
          </div>
        </form>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="sacuvaj()">Sačuvaj</button>
        <button nbButton status="danger" (click)="otkazi()">Otkaži</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['./edit-pozicije-modal.component.scss']
})
export class EditPozicijaModalComponent {
  @Input() set pozicija(value: ProdajnaPozicija | undefined) {
    if (value) {
      this.tempPozicija = { ...value };
    }
  }
  @Output() close = new EventEmitter<ProdajnaPozicija | null>();

  tempPozicija: ProdajnaPozicija = {
    naziv: '',
    brojPozicije: '',
    tip: '',
    pozicijaX: 0,
    pozicijaY: 0,
    sirina: 1,
    duzina: 1,
    rotacija: 0
  };

  sacuvaj() {
    this.close.emit({ ...this.tempPozicija });
  }

  otkazi() {
    this.close.emit(null);
  }
}