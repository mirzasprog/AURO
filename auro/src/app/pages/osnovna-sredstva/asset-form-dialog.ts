import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FixedAssetDetail, FixedAssetRequest, FixedAssetsService } from '../../@core/services/fixed-assets.service';
import SignaturePad from 'signature_pad';
import { ExportPDFService } from '../../@core/services/print-asset.service';

@Component({
  selector: 'ngx-asset-form-dialog',
  template: `
    <nb-card>
      <nb-card-header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h5>{{ asset ? 'Uredi sredstvo' : 'Novo osnovno sredstvo' }}</h5>
          <button nbButton ghost (click)="close()"><nb-icon icon="close-outline"></nb-icon></button>
        </div>
      </nb-card-header>

      <nb-card-body style="max-height: 85vh; overflow-y: auto;">
        <form [formGroup]="form">
          <div class="form-grid">
            <div class="form-field">
              <label class="label">Kategorija *</label>
              <nb-select formControlName="categoryId" fullWidth size="small">
                <nb-option *ngFor="let option of categories" [value]="option.id">{{ option.label }}</nb-option>
              </nb-select>
            </div>
            <div class="form-field col-2">
              <label class="label">Naziv *</label>
              <input nbInput fullWidth size="small" formControlName="name" />
            </div>
            <div class="form-field">
              <label class="label">Inventurni broj *</label>
              <input nbInput fullWidth size="small" formControlName="inventoryNumber" />
            </div>
            <div class="form-field">
              <label class="label">Serijski broj *</label>
              <input nbInput fullWidth size="small" formControlName="serialNumber" />
            </div>
            <div class="form-field">
              <label class="label">Nabavna cijena (KM) *</label>
              <input nbInput fullWidth size="small" type="number" formControlName="purchasePrice" />
            </div>
            <div class="form-field">
              <label class="label">Amortizacija (god)</label>
              <input nbInput fullWidth size="small" type="number" formControlName="amortizationYears" />
            </div>
            <div class="form-field">
              <label class="label">Datum nabavke *</label>
              <input nbInput fullWidth size="small" type="date" formControlName="purchaseDate" />
            </div>

            <div class="form-field">
              <label class="label">Trenutna vrijednost (Amortizovano)</label>
              <div class="calculated-value">
                {{ (amortizedValue | number: '1.2-2') || '0.00' }} KM
              </div>
            </div>

            <div class="form-field">
              <label class="label">Zadužuje</label>
              <input nbInput fullWidth size="small" formControlName="assignedTo" />
            </div>
             <div class="form-field">
              <label class="label">Lokacija</label>
              <input nbInput fullWidth size="small" formControlName="location" />
            </div>
            <div class="form-field full-width">
              <label class="label">Napomene</label>
              <textarea nbInput fullWidth rows="1" formControlName="notes"></textarea>
            </div>

            <div class="signature-section full-width">
               <div class="sig-block">
                  <label class="label">POTPIS OSOBE KOJA PREDAJE</label>
                  <div class="sig-canvas-wrapper"><canvas #sigPredao></canvas></div>
                  <button nbButton ghost status="danger" size="tiny" type="button" (click)="clearSig('predao')">Očisti</button>
               </div>
               <div class="sig-block">
                  <label class="label">POTPIS OSOBE KOJA PREUZIMA</label>
                  <div class="sig-canvas-wrapper"><canvas #sigPreuzeo></canvas></div>
                  <button nbButton ghost status="danger" size="tiny" type="button" (click)="clearSig('preuzeo')">Očisti</button>
               </div>
            </div>
          </div>
        </form>
      </nb-card-body>

      <nb-card-footer>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button nbButton (click)="close()">Otkaži</button>
          <button nbButton status="primary" (click)="submit()" [disabled]="form.invalid || isSubmitting">
            {{ isSubmitting ? 'Spremanje...' : 'Sačuvaj i Printaj' }}
          </button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    nb-card { width: 950px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .form-field { display: flex; flex-direction: column; }
    .full-width { grid-column: 1 / -1; }
    .col-2 { grid-column: span 2; }
    .label { font-size: 0.75rem; font-weight: bold; color: #222b45; margin-bottom: 4px; }
    .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
    .sig-block { background: #f7f9fc; padding: 15px; border-radius: 4px; border: 1px solid #edf1f7; text-align: center; }
    .sig-canvas-wrapper { background: #fff; border: 1px solid #8f9bb3; height: 180px; margin-bottom: 5px; }
    canvas { width: 100%; height: 180px; cursor: crosshair; }
    .calculated-value { background: #ebfcf4; border: 1px solid #b7f2d7; color: #00914d; padding: 0.5rem; border-radius: 6px; font-weight: bold; height: 36px; display: flex; align-items: center; }
  `]
})
export class AssetFormDialogComponent implements OnInit, AfterViewInit {
  @Input() asset?: any;
  @Input() categories: any[] = [];
  @ViewChild('sigPredao') sigPredaoElement!: ElementRef;
  @ViewChild('sigPreuzeo') sigPreuzeoElement!: ElementRef;

  private padPredao!: SignaturePad;
  private padPreuzeo!: SignaturePad;
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<any>,
    private fixedAssetsService: FixedAssetsService,
    private toastrService: NbToastrService,
    private exportService: ExportPDFService,
    private cd: ChangeDetectorRef // Dodano za stabilnost
  ) {
    this.form = this.fb.group({
      categoryId: [null, Validators.required],
      name: ['', Validators.required],
      inventoryNumber: ['', Validators.required],
      serialNumber: ['', Validators.required],
      purchasePrice: [0, Validators.required],
      purchaseDate: ['', Validators.required],
      amortizationYears: [5, Validators.required],
      assignedTo: [''],
      location: [''],
      notes: [''],
      status: ['Aktivan'],
      supplier: ['-']
    });
  }

  ngOnInit() { 
    if (this.asset) this.form.patchValue(this.asset); 
  }

  ngAfterViewInit() {
    this.initPads();
    this.cd.detectChanges(); // Forsiraj detekciju nakon inicijalizacije canvasa
  }

  private initPads() {
    const setupPad = (el: ElementRef) => {
      const canvas = el.nativeElement;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      return new SignaturePad(canvas);
    };

    this.padPredao = setupPad(this.sigPredaoElement);
    this.padPreuzeo = setupPad(this.sigPreuzeoElement);
  }

  clearSig(type: 'predao' | 'preuzeo') {
    if (type === 'predao') this.padPredao.clear();
    else this.padPreuzeo.clear();
  }

  // FIKSIRANO: Dodan Math.round da se izbjegne NG0100 greška
  get amortizedValue(): number {
    const price = Number(this.form.get('purchasePrice')?.value) || 0;
    const years = Number(this.form.get('amortizationYears')?.value) || 1;
    const dateVal = this.form.get('purchaseDate')?.value;
    
    if (!dateVal) return price;

    const pDate = new Date(dateVal);
    const today = new Date();
    // Koristimo fiksni trenutak (početak dana) da spriječimo milisekundne promjene
    today.setHours(0,0,0,0); 
    
    const diff = (today.getTime() - pDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const val = Math.max(0, price - (price / years) * Math.min(years, diff));
    
    return Math.round(val * 100) / 100; // Zaokruživanje na 2 decimale rješava grešku
  }

  submit() {
    if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    }
    
    this.isSubmitting = true;
    
    // Čisti payload za API (šaljemo samo ono što baza prima)
    const payload: FixedAssetRequest = { ...this.form.value };

    const request$ = this.asset 
      ? this.fixedAssetsService.updateAsset(this.asset.id, payload)
      : this.fixedAssetsService.createAsset(payload);

    request$.subscribe({
      next: (detail) => {
        // Podaci za PDF (ovdje dodajemo izračunatu vrijednost)
        const assetForPdf = {
          ...detail,
          calculatedAmortization: this.amortizedValue
        };

        const sig1 = !this.padPredao.isEmpty() ? this.padPredao.toDataURL() : undefined;
        const sig2 = !this.padPreuzeo.isEmpty() ? this.padPreuzeo.toDataURL() : undefined;

        this.exportService.exportZaduzenjePdf([assetForPdf], sig1, sig2);
        
        this.toastrService.success('Uspješno sačuvano', 'Uspjeh');
        this.dialogRef.close(detail);
      },
      error: (err) => { 
        this.isSubmitting = false; 
        console.error(err);
        this.toastrService.danger('Greška pri komunikaciji sa serverom (400 Bad Request)', 'Greška'); 
      }
    });
  }

  close() { this.dialogRef.close(); }
}