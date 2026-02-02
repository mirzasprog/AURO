import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import {
  FixedAssetAdvancedReportItem,
  FixedAssetAssignmentRequest,
  FixedAssetCategory,
  FixedAssetCategoryRequest,
  FixedAssetDetail,
  FixedAssetRequest,
  FixedAssetServiceRecordRequest,
  FixedAssetSummary,
  FixedAssetsService,
  FixedAssetListItem
} from '../../@core/services/fixed-assets.service';

interface CategoryOption {
  id: number;
  label: string;
}

@Component({
  selector: 'ngx-osnovna-sredstva',
  templateUrl: './osnovna-sredstva.component.html',
  styleUrls: ['./osnovna-sredstva.component.scss']
})
export class OsnovnaSredstvaComponent implements OnInit {
  categories: FixedAssetCategory[] = [];
  categoryOptions: CategoryOption[] = [];
  assets: FixedAssetListItem[] = [];
  summary: FixedAssetSummary[] = [];
  selectedAsset?: FixedAssetDetail;

  categoryForm: FormGroup;
  assetForm: FormGroup;
  assignmentForm: FormGroup;
  serviceForm: FormGroup;
  filterForm: FormGroup;
  reportForm: FormGroup;

  isSubmitting = false;
  isLoadingAssets = false;
  isLoadingReport = false;

  statusOptions = ['Aktivan', 'Na servisu', 'Razdužen', 'U pripremi'];
  reportItems: FixedAssetAdvancedReportItem[] = [];

  constructor(
    private fb: FormBuilder,
    private fixedAssetsService: FixedAssetsService,
    private toastrService: NbToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(400)]],
      parentCategoryId: [null]
    });

    this.assetForm = this.fb.group({
      categoryId: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      inventoryNumber: ['', [Validators.required, Validators.maxLength(100)]],
      serialNumber: ['', [Validators.required, Validators.maxLength(100)]],
      purchasePrice: [null, Validators.required],
      supplier: ['', [Validators.required, Validators.maxLength(200)]],
      purchaseDate: ['', Validators.required],
      warrantyUntil: [null],
      amortizationYears: [null, [Validators.min(1), Validators.max(100)]],
      location: [''],
      department: [''],
      status: ['Aktivan'],
      assignedTo: [''],
      notes: [''],
      isActive: [true]
    });

    this.assignmentForm = this.fb.group({
      assignedTo: ['', [Validators.required, Validators.maxLength(150)]],
      assignedBy: [''],
      department: [''],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [null],
      status: ['Zaduženo'],
      note: ['']
    });

    this.serviceForm = this.fb.group({
      serviceDate: ['', Validators.required],
      vendor: [''],
      description: [''],
      cost: [null],
      nextServiceDate: [null],
      documentNumber: [''],
      status: ['U servisu']
    });

    this.filterForm = this.fb.group({
      search: [''],
      categoryId: [null],
      status: ['']
    });

    this.reportForm = this.fb.group({
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
    this.loadSummary();
    this.loadCategories();
    this.loadAssets();
    this.loadAdvancedReport();
  }

  loadSummary(): void {
    this.fixedAssetsService.getSummary().subscribe((summary) => {
      this.summary = summary;
    });
  }

  loadCategories(): void {
    this.fixedAssetsService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoryOptions = this.flattenCategories(categories);
    });
  }

  loadAssets(): void {
    this.isLoadingAssets = true;
    const filters = this.filterForm.value;
    this.fixedAssetsService.getAssets(filters).subscribe((assets) => {
      this.assets = assets;
      this.isLoadingAssets = false;
    });
  }

  selectAsset(asset: FixedAssetListItem): void {
    this.fixedAssetsService.getAsset(asset.id).subscribe((detail) => {
      this.selectedAsset = detail;
      this.assetForm.patchValue({
        categoryId: detail.categoryId,
        name: detail.name,
        description: detail.description,
        inventoryNumber: detail.inventoryNumber,
        serialNumber: detail.serialNumber,
        purchasePrice: detail.purchasePrice,
        supplier: detail.supplier,
        purchaseDate: detail.purchaseDate,
        warrantyUntil: detail.warrantyUntil,
        amortizationYears: detail.amortizationYears,
        location: detail.location,
        department: detail.department,
        status: detail.status,
        assignedTo: detail.assignedTo,
        notes: detail.notes,
        isActive: detail.isActive
      });
    });
  }

  resetAssetForm(): void {
    this.selectedAsset = undefined;
    this.assetForm.reset({
      categoryId: null,
      status: 'Aktivan',
      isActive: true,
      amortizationYears: null
    });
  }

  submitCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const request: FixedAssetCategoryRequest = this.categoryForm.value;
    this.fixedAssetsService.createCategory(request).subscribe(() => {
      this.categoryForm.reset({ parentCategoryId: null });
      this.loadCategories();
    });
  }

  submitAsset(): void {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      this.toastrService.warning('Provjerite obavezna polja.', 'Validacija');
      return;
    }

    this.isSubmitting = true;
    const payload: FixedAssetRequest = this.assetForm.value;

    const request$ = this.selectedAsset
      ? this.fixedAssetsService.updateAsset(this.selectedAsset.id, payload)
      : this.fixedAssetsService.createAsset(payload);

    request$.subscribe({
      next: (detail) => {
        this.selectedAsset = detail;
        this.isSubmitting = false;
        this.loadAssets();
        this.loadSummary();
        this.loadAdvancedReport();
        this.toastrService.success('Osnovno sredstvo je sačuvano.', 'Uspjeh');
      },
      error: (error) => {
        this.isSubmitting = false;
        const message = error?.error?.poruka || 'Greška pri spremanju osnovnog sredstva.';
        this.toastrService.danger(message, 'Greška');
      }
    });
  }

  submitAssignment(): void {
    if (!this.selectedAsset) {
      return;
    }

    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    const payload: FixedAssetAssignmentRequest = this.assignmentForm.value;
    this.fixedAssetsService.addAssignment(this.selectedAsset.id, payload).subscribe(() => {
      this.assignmentForm.reset({ status: 'Zaduženo' });
      this.selectAsset({
        id: this.selectedAsset!.id,
        name: this.selectedAsset!.name,
        inventoryNumber: this.selectedAsset!.inventoryNumber,
        serialNumber: this.selectedAsset!.serialNumber,
        categoryName: this.selectedAsset!.categoryName,
        purchasePrice: this.selectedAsset!.purchasePrice,
        purchaseDate: this.selectedAsset!.purchaseDate
      });
      this.loadAssets();
    });
  }

  submitServiceRecord(): void {
    if (!this.selectedAsset) {
      return;
    }

    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const payload: FixedAssetServiceRecordRequest = this.serviceForm.value;
    this.fixedAssetsService.addServiceRecord(this.selectedAsset.id, payload).subscribe(() => {
      this.serviceForm.reset({ status: 'U servisu' });
      this.selectAsset({
        id: this.selectedAsset!.id,
        name: this.selectedAsset!.name,
        inventoryNumber: this.selectedAsset!.inventoryNumber,
        serialNumber: this.selectedAsset!.serialNumber,
        categoryName: this.selectedAsset!.categoryName,
        purchasePrice: this.selectedAsset!.purchasePrice,
        purchaseDate: this.selectedAsset!.purchaseDate
      });
    });
  }

  applyFilters(): void {
    this.loadAssets();
  }

  loadAdvancedReport(): void {
    this.isLoadingReport = true;
    const filters = this.reportForm.value;
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

  get amortizedValue(): number | null {
    const purchasePrice = Number(this.assetForm.get('purchasePrice')?.value);
    const amortizationYears = Number(this.assetForm.get('amortizationYears')?.value);
    const purchaseDateValue = this.assetForm.get('purchaseDate')?.value;

    if (!purchasePrice || !amortizationYears || !purchaseDateValue) {
      return null;
    }

    const purchaseDate = new Date(purchaseDateValue);
    if (Number.isNaN(purchaseDate.getTime())) {
      return null;
    }

    const today = new Date();
    const diffYears = Math.min(
      amortizationYears,
      (today.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const depreciatedValue = purchasePrice - (purchasePrice / amortizationYears) * diffYears;
    return Math.max(0, Number(depreciatedValue.toFixed(2)));
  }

  get reportTotals(): { totalAssets: number; totalPurchasePrice: number; totalDepreciatedValue: number } {
    const totalAssets = this.reportItems.length;
    const totalPurchasePrice = this.reportItems.reduce((sum, item) => sum + (item.purchasePrice || 0), 0);
    const totalDepreciatedValue = this.reportItems.reduce((sum, item) => sum + (item.depreciatedValue || 0), 0);
    return { totalAssets, totalPurchasePrice, totalDepreciatedValue };
  }

  private flattenCategories(categories: FixedAssetCategory[], level = 0): CategoryOption[] {
    return categories.reduce<CategoryOption[]>((options, category) => {
      const label = `${'—'.repeat(level)} ${category.name}`.trim();
      const children = category.children?.length
        ? this.flattenCategories(category.children, level + 1)
        : [];
      options.push({ id: category.id, label }, ...children);
      return options;
    }, []);
  }
}
