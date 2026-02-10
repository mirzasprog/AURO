import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import {
  FixedAssetAdvancedReportItem,
  FixedAssetAssignmentRequest,
  FixedAssetCategory,
  FixedAssetDetail,
  FixedAssetServiceRecordRequest,
  FixedAssetSummary,
  FixedAssetsService,
  FixedAssetListItem
} from '../../@core/services/fixed-assets.service';
import { ChartUtils } from './chart-utils';
import { AssetFormDialogComponent } from './asset-form-dialog';
import { CategoryFormDialogComponent } from './category-form-dialog';
import { ReportDialogComponent } from './report-dialog';


interface CategoryOption {
  id: number;
  label: string;
}

interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

interface StatCard {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'ngx-osnovna-sredstva',
  templateUrl: './osnovna-sredstva.component.html',
  styleUrls: ['./osnovna-sredstva.component.scss']
})
export class OsnovnaSredstvaComponent implements OnInit, AfterViewInit, OnDestroy {
  categories: FixedAssetCategory[] = [];
  categoryOptions: CategoryOption[] = [];
  assets: FixedAssetListItem[] = [];
  summary: FixedAssetSummary[] = [];
  selectedAsset?: FixedAssetDetail;

  assignmentForm: FormGroup;
  serviceForm: FormGroup;
  filterForm: FormGroup;

  isLoadingAssets = false;
  
  // View modes
  showFilters = false;

  statusOptions = ['Aktivan', 'Na servisu', 'Razdužen', 'U pripremi'];

  // Statistics and charts
  statsCards: StatCard[] = [];
  categoryChartData: ChartData = { labels: [], values: [], colors: [] };
  statusChartData: ChartData = { labels: [], values: [], colors: [] };
  valueChartData: ChartData = { labels: [], values: [], colors: [] };

  // Chart.js instances
  private categoryChart: any = null;
  private statusChart: any = null;
  private valueChart: any = null;
  
  activeTab: 'assignments' | 'service' = 'assignments';

  // Dialog reference for detail view
  private detailDialogRef: any;

  constructor(
    private fb: FormBuilder,
    private fixedAssetsService: FixedAssetsService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {
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
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadCategories();
    this.loadAssets();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 500);
  }

  ngOnDestroy(): void {
    ChartUtils.destroyChart(this.categoryChart);
    ChartUtils.destroyChart(this.statusChart);
    ChartUtils.destroyChart(this.valueChart);
  }

  private initializeCharts(): void {
    this.updateChartsVisuals();
  }

  private updateChartsVisuals(): void {
    ChartUtils.destroyChart(this.categoryChart);
    ChartUtils.destroyChart(this.statusChart);
    ChartUtils.destroyChart(this.valueChart);

    this.categoryChart = ChartUtils.createCategoryChart(
      'categoryChart',
      this.categoryChartData.labels,
      this.categoryChartData.values,
      this.categoryChartData.colors
    );

    this.statusChart = ChartUtils.createStatusChart(
      'statusChart',
      this.statusChartData.labels,
      this.statusChartData.values,
      this.statusChartData.colors
    );

    this.valueChart = ChartUtils.createValueChart(
      'valueChart',
      this.valueChartData.labels,
      this.valueChartData.values,
      this.valueChartData.colors
    );
  }

  // ==================== DIALOG METHODS ====================

  openAssetModal(asset?: FixedAssetDetail): void {
    this.dialogService.open(AssetFormDialogComponent, {
      context: {
        asset: asset,
        categories: this.categoryOptions
      },
      closeOnBackdropClick: false,
      hasBackdrop: true
    }).onClose.subscribe((result) => {
      if (result) {
        this.loadAssets();
        this.loadSummary();
      }
    });
  }

  openCategoryModal(): void {
    this.dialogService.open(CategoryFormDialogComponent, {
      context: {
        categories: this.categoryOptions
      },
      closeOnBackdropClick: false,
      hasBackdrop: true
    }).onClose.subscribe((result) => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openReportModal(): void {
    this.dialogService.open(ReportDialogComponent, {
      context: {
        categories: this.categoryOptions
      },
      closeOnBackdropClick: false,
      hasBackdrop: true
    });
  }

  openAssetDetails(asset: FixedAssetListItem): void {
    this.fixedAssetsService.getAsset(asset.id).subscribe((detail) => {
      this.selectedAsset = detail;
      // Open detail dialog (implement AssetDetailDialogComponent separately if needed)
      // For now, we can use a simple approach or create another dialog component
      this.toastrService.info('Detalji: ' + detail.name, 'Info');
      // TODO: Create AssetDetailDialogComponent for full detail view
    });
  }

  editAssetById(asset: FixedAssetListItem): void {
    this.fixedAssetsService.getAsset(asset.id).subscribe((detail) => {
      this.openAssetModal(detail);
    });
  }

  editAsset(asset: FixedAssetDetail): void {
    this.openAssetModal(asset);
  }

  // ==================== DATA METHODS ====================

  loadSummary(): void {
    this.fixedAssetsService.getSummary().subscribe((summary) => {
      this.summary = summary;
      this.updateStatistics();
      this.updateCharts();
    });
  }

  loadCategories(): void {
    this.fixedAssetsService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoryOptions = this.flattenCategories(categories);
      this.updateCharts();
    });
  }

  loadAssets(): void {
    this.isLoadingAssets = true;
    const filters = this.filterForm.value;
    this.fixedAssetsService.getAssets(filters).subscribe((assets) => {
      this.assets = assets;
      this.isLoadingAssets = false;
      this.updateCharts();
    });
  }

  applyFilters(): void {
    this.loadAssets();
  }

  updateStatistics(): void {
    const totalAssets = this.summary.reduce((sum, s) => sum + s.totalAssets, 0);
    const totalActive = this.summary.reduce((sum, s) => sum + s.activeAssets, 0);
    const totalAssigned = this.summary.reduce((sum, s) => sum + s.assignedAssets, 0);
    const totalValue = this.summary.reduce((sum, s) => sum + s.totalPurchasePrice, 0);

    this.statsCards = [
      {
        title: 'Ukupno sredstava',
        value: totalAssets,
        subtitle: `${totalActive} aktivnih`,
        icon: 'cube-outline',
        color: '#0066cc'
      },
      {
        title: 'Zaduženo',
        value: totalAssigned,
        subtitle: `${totalAssets > 0 ? ((totalAssigned / totalAssets) * 100).toFixed(0) : 0}% od ukupnog`,
        icon: 'people-outline',
        color: '#28a745'
      },
      {
        title: 'Ukupna vrijednost',
        value: `${totalValue.toLocaleString('hr-HR', { minimumFractionDigits: 2 })} KM`,
        subtitle: 'Nabavna cijena',
        icon: 'trending-up-outline',
        color: '#17a2b8'
      },
      {
        title: 'Kategorije',
        value: this.summary.length,
        subtitle: 'različitih kategorija',
        icon: 'grid-outline',
        color: '#ffc107'
      }
    ];
  }

  updateCharts(): void {
    const categoryColors = ['#0066cc', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1'];
    
    this.categoryChartData = {
      labels: this.summary.map(s => s.categoryName),
      values: this.summary.map(s => s.totalAssets),
      colors: this.summary.map((_, i) => categoryColors[i % categoryColors.length])
    };

    const statusCounts = this.statusOptions.reduce((acc, status) => {
      acc[status] = this.assets.filter(a => a.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    this.statusChartData = {
      labels: Object.keys(statusCounts),
      values: Object.values(statusCounts),
      colors: ['#28a745', '#ffc107', '#dc3545', '#17a2b8']
    };

    this.valueChartData = {
      labels: this.summary.map(s => s.categoryName),
      values: this.summary.map(s => s.totalPurchasePrice),
      colors: this.summary.map((_, i) => categoryColors[i % categoryColors.length])
    };

    if (this.categoryChart || this.statusChart || this.valueChart) {
      this.updateChartsVisuals();
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Aktivan': 'status-active',
      'Na servisu': 'status-service',
      'Razdužen': 'status-discharged',
      'U pripremi': 'status-preparation'
    };
    return statusMap[status] || 'status-default';
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