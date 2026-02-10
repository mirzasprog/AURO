import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FixedAssetAdvancedReportItem, FixedAssetsService } from '../../@core/services/fixed-assets.service';


interface CategoryOption {
  id: number;
  label: string;
}

@Component({
  selector: 'ngx-report-dialog',
  template: `
    <nb-card>
      <nb-card-header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h5>Generiši izvještaj</h5>
          <button nbButton ghost size="small" (click)="close()">
            <nb-icon icon="close-outline"></nb-icon>
          </button>
        </div>
      </nb-card-header>

      <nb-card-body style="max-height: 70vh; overflow-y: auto;">
        <form [formGroup]="form">
          <div class="form-grid">
            <div class="form-field">
              <label class="label">Kategorija</label>
              <nb-select placeholder="Sve" formControlName="categoryId" fullWidth size="small">
                <nb-option [value]="null">Sve</nb-option>
                <nb-option *ngFor="let option of categories" [value]="option.id">
                  {{ option.label }}
                </nb-option>
              </nb-select>
            </div>

            <div class="form-field">
              <label class="label">Status</label>
              <nb-select placeholder="Svi" formControlName="status" fullWidth size="small">
                <nb-option value="">Svi</nb-option>
                <nb-option value="Aktivan">Aktivan</nb-option>
                <nb-option value="Na servisu">Na servisu</nb-option>
                <nb-option value="Razdužen">Razdužen</nb-option>
                <nb-option value="U pripremi">U pripremi</nb-option>
              </nb-select>
            </div>

            <div class="form-field">
              <label class="label">Sektor</label>
              <input nbInput fullWidth size="small" formControlName="department" />
            </div>

            <div class="form-field">
              <label class="label">Lokacija</label>
              <input nbInput fullWidth size="small" formControlName="location" />
            </div>

            <div class="form-field">
              <label class="label">Datum nabavke od</label>
              <input nbInput fullWidth size="small" type="date" formControlName="purchaseDateFrom" />
            </div>

            <div class="form-field">
              <label class="label">Datum nabavke do</label>
              <input nbInput fullWidth size="small" type="date" formControlName="purchaseDateTo" />
            </div>

            <div class="form-field">
              <label class="label">Cijena od (KM)</label>
              <input nbInput fullWidth size="small" type="number" formControlName="priceMin" />
            </div>

            <div class="form-field">
              <label class="label">Cijena do (KM)</label>
              <input nbInput fullWidth size="small" type="number" formControlName="priceMax" />
            </div>
          </div>
        </form>

        <div class="report-summary" *ngIf="reportItems.length > 0">
          <nb-card size="tiny">
            <nb-card-body>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="label">Broj sredstava</span>
                  <span class="value">{{ reportTotals.totalAssets }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Nabavna vrijednost</span>
                  <span class="value">{{ reportTotals.totalPurchasePrice | number: '1.2-2' }} KM</span>
                </div>
                <div class="summary-item">
                  <span class="label">Amortizovana</span>
                  <span class="value">{{ reportTotals.totalDepreciatedValue | number: '1.2-2' }} KM</span>
                </div>
              </div>
            </nb-card-body>
          </nb-card>
        </div>
      </nb-card-body>

      <nb-card-footer>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button nbButton status="basic" (click)="close()">Zatvori</button>
          <button nbButton status="info" (click)="preview()" [disabled]="isLoadingReport">
            <nb-icon icon="eye-outline"></nb-icon>
            Pregled
          </button>
          <button nbButton status="primary" (click)="generate()" [disabled]="isLoadingReport">
            <nb-icon icon="download-outline"></nb-icon>
            {{ isLoadingReport ? 'Generišem...' : 'Generiši Excel' }}
          </button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    nb-card {
      margin: 0;
      max-width: 900px;
      width: 100%;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .report-summary {
      margin-top: 1.5rem;

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;

        .label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: var(--text-muted);
        }

        .value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }
      }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .report-summary .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportDialogComponent implements OnInit {
  @Input() categories: CategoryOption[] = [];

  form: FormGroup;
  reportItems: FixedAssetAdvancedReportItem[] = [];
  isLoadingReport = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<ReportDialogComponent>,
    private fixedAssetsService: FixedAssetsService,
    private toastrService: NbToastrService
  ) {
    this.form = this.fb.group({
      categoryId: [null],
      status: [''],
      department: [''],
      location: [''],
      supplier: [''],
      assignedTo: [''],
      purchaseDateFrom: [''],
      purchaseDateTo: [''],
      priceMin: [null],
      priceMax: [null],
      amortizationMin: [null],
      amortizationMax: [null]
    });
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoadingReport = true;
    const filters = this.form.value;
    const normalizedFilters = {
      ...filters,
      purchaseDateFrom: filters.purchaseDateFrom || undefined,
      purchaseDateTo: filters.purchaseDateTo || undefined,
      priceMin: filters.priceMin ? Number(filters.priceMin) : null,
      priceMax: filters.priceMax ? Number(filters.priceMax) : null,
      amortizationMin: filters.amortizationMin ? Number(filters.amortizationMin) : null,
      amortizationMax: filters.amortizationMax ? Number(filters.amortizationMax) : null
    };

    this.fixedAssetsService.getAdvancedReport(normalizedFilters).subscribe({
      next: (items) => {
        this.reportItems = items;
        this.isLoadingReport = false;
      },
      error: () => {
        this.reportItems = [];
        this.isLoadingReport = false;
      }
    });
  }

  preview(): void {
    this.loadReport();
  }

  generate(): void {
    this.loadReport();
    this.toastrService.info('Excel izvještaj se generiše...', 'Izvoz');
    // TODO: Implement actual Excel export
    // Example: this.fixedAssetsService.exportToExcel(this.reportItems);
  }

  get reportTotals(): { totalAssets: number; totalPurchasePrice: number; totalDepreciatedValue: number } {
    const totalAssets = this.reportItems.length;
    const totalPurchasePrice = this.reportItems.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
    const totalDepreciatedValue = this.reportItems.reduce((sum, item) => sum + (item.depreciatedValue || 0), 0);
    return { totalAssets, totalPurchasePrice, totalDepreciatedValue };
  }

  close(): void {
    this.dialogRef.close();
  }
}