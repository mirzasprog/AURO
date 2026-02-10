import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FixedAssetsService, FixedAssetCategoryRequest } from '../../@core/services/fixed-assets.service';


interface CategoryOption {
  id: number;
  label: string;
}

@Component({
  selector: 'ngx-category-form-dialog',
  template: `
    <nb-card>
      <nb-card-header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h5>Nova kategorija</h5>
          <button nbButton ghost size="small" (click)="close()">
            <nb-icon icon="close-outline"></nb-icon>
          </button>
        </div>
      </nb-card-header>

      <nb-card-body>
        <form [formGroup]="form">
          <div class="form-grid">
            <div class="form-field">
              <label class="label">Naziv kategorije *</label>
              <input nbInput fullWidth size="small" placeholder="npr. Računari" formControlName="name" />
            </div>

            <div class="form-field">
              <label class="label">Nadređena kategorija</label>
              <nb-select placeholder="Glavna" formControlName="parentCategoryId" fullWidth size="small">
                <nb-option [value]="null">Glavna kategorija</nb-option>
                <nb-option *ngFor="let option of categories" [value]="option.id">
                  {{ option.label }}
                </nb-option>
              </nb-select>
            </div>

            <div class="form-field full-width">
              <label class="label">Opis</label>
              <textarea nbInput fullWidth rows="3" formControlName="description"></textarea>
            </div>
          </div>
        </form>

        <div class="category-list" *ngIf="categories.length > 0">
          <h6>Postojeće kategorije:</h6>
          <div class="category-tags">
            <nb-tag *ngFor="let option of categories" size="tiny" appearance="outline">
              {{ option.label }}
            </nb-tag>
          </div>
        </div>
      </nb-card-body>

      <nb-card-footer>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button nbButton status="basic" (click)="close()">Otkaži</button>
          <button nbButton status="primary" (click)="submit()" [disabled]="form.invalid">
            Dodaj kategoriju
          </button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    nb-card {
      margin: 0;
      max-width: 500px;
      width: 100%;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      &.full-width {
        grid-column: 1 / -1;
      }
    }

    .label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .category-list {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--card-border);

      h6 {
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
      }

      .category-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-height: 120px;
        overflow-y: auto;
      }
    }
  `]
})
export class CategoryFormDialogComponent implements OnInit {
  @Input() categories: CategoryOption[] = [];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<CategoryFormDialogComponent>,
    private fixedAssetsService: FixedAssetsService,
    private toastrService: NbToastrService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(400)]],
      parentCategoryId: [null]
    });
  }

  ngOnInit(): void {
    // Nothing to initialize
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: FixedAssetCategoryRequest = this.form.value;
    this.fixedAssetsService.createCategory(request).subscribe({
      next: () => {
        this.toastrService.success('Kategorija uspješno dodana', 'Uspjeh');
        this.dialogRef.close(true);
      },
      error: (error) => {
        const message = error?.error?.poruka || 'Greška pri kreiranju kategorije';
        this.toastrService.danger(message, 'Greška');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}