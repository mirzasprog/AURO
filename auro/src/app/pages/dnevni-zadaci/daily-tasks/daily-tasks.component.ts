import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DailyTask, DailyTaskBulkPayload, DailyTaskPayload, DailyTaskStore } from '../../../@core/data/daily-task';
import { DailyTaskService } from '../../../@core/utils/daily-task.service';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { CustomTaskDialogComponent } from '../custom-task-dialog/custom-task-dialog.component';

@Component({
  selector: 'ngx-daily-tasks',
  templateUrl: './daily-tasks.component.html',
  styleUrls: ['./daily-tasks.component.scss']
})
export class DailyTasksComponent implements OnInit, OnDestroy {
  readonly repetitiveType = 'REPETITIVE';
  readonly customType = 'CUSTOM';

  tasks: DailyTask[] = [];
  repetitiveTasks: DailyTask[] = [];
  customTasks: DailyTask[] = [];
  historyTasks: DailyTask[] = [];
  summaryCards: { title: string; subtitle: string; value: number | string; icon: string; accent: 'primary' | 'success' | 'info' }[] = [];
  statusChartData: { name: string; value: number }[] = [];
  readonly statusChartColorScheme = { domain: ['#5E81F4', '#FFBC6E', '#36D6AE'] };
  readonly chartGradient = false;
  readonly chartShowLabels = false;
  readonly chartDoughnut = true;
  stores: DailyTaskStore[] = [];
  selectedStoreId?: number;
  historyStoreId?: number | null;
  currentStoreId?: number;
  loading = false;
  historyLoading = false;
  reportLoading = false;
  rola:any;
  role: string | null = null;
  readonly today = new Date();
  readonly statusLabelMap: Record<string, string> = {
    OPEN: 'Otvoreni',
    IN_PROGRESS: 'U toku',
    DONE: 'Završeni'
  };
  historyFrom = '';
  historyTo = '';
  historyStatus = 'DONE';
  historyType = 'ALL';
  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: NbAuthService,
    private readonly dailyTaskService: DailyTaskService,
    private readonly dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
    this.rola = token.getPayload();
    });
    this.authService.getToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        this.role = token.getPayload()?.['role'] ?? null;
        const storeIdPayload = token.getPayload()?.['prodavnicaId'] ?? token.getPayload()?.['storeId'];
        if (storeIdPayload) {
          const parsed = Number(storeIdPayload);
          this.currentStoreId = Number.isNaN(parsed) ? undefined : parsed;
          this.selectedStoreId = this.currentStoreId;
        }
        this.loadInitialData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canManageStores(): boolean {
    return this.role !== 'prodavnica';
  }

  get canBulkCreate(): boolean {
    return this.role === 'uprava';
  }

  get canCreateCustomTasks(): boolean {
    return this.canManageStores || this.role === 'prodavnica';
  }

  get isStoreSelected(): boolean {
    return !this.canManageStores || !!this.selectedStoreId;
  }

  get hasTasks(): boolean {
    return this.tasks.length > 0;
  }

  get hasHistoryTasks(): boolean {
    return this.historyTasks.length > 0;
  }

  get headlineDate(): string {
    return this.today.toLocaleDateString('bs-BA', { weekday: 'long', day: '2-digit', month: 'long' });
  }

  onStoreChange(): void {
    this.refreshTasks();
  }

  refreshTasks(): void {
    if (!this.isStoreSelected) {
      return;
    }

    this.loading = true;
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    this.dailyTaskService.getTodayTasks(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          if (!this.canManageStores) {
            const derivedStoreId = tasks.length ? tasks[0].prodavnicaId : undefined;
            if (derivedStoreId) {
              this.currentStoreId = derivedStoreId;
              this.selectedStoreId = this.selectedStoreId ?? derivedStoreId;
            }
          }
          this.updateDerivedCollections();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom preuzimanja zadataka: ${poruka}`, 'error');
        }
      });
  }

  refreshHistory(): void {
    if (!this.historyFrom || !this.historyTo) {
      return;
    }

    const fromDate = new Date(this.historyFrom);
    const toDate = new Date(this.historyTo);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate > toDate) {
      return;
    }

    this.historyLoading = true;
    const storeId = this.canManageStores ? this.historyStoreId ?? undefined : undefined;
    const status = this.historyStatus !== 'ALL' ? this.historyStatus : undefined;
    const type = this.historyType !== 'ALL' ? this.historyType : undefined;

    this.dailyTaskService.getHistoryTasks({
      storeId,
      from: this.historyFrom,
      to: this.historyTo,
      status,
      type
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.historyTasks = tasks;
          this.historyLoading = false;
        },
        error: (err) => {
          this.historyLoading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom preuzimanja historije: ${poruka}`, 'error');
        }
      });
  }

  openTask(task: DailyTask): void {
    const dialogRef = this.dialogService.open(TaskDetailDialogComponent, {
      context: {
        task,
        canEdit: this.canCreateCustomTasks
      },
      closeOnBackdropClick: false
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((updated: DailyTask | null) => {
      if (updated) {
        this.replaceTask(updated);
      }
    });
  }

  createCustomTask(): void {
    const targetStoreId = this.canManageStores
      ? this.selectedStoreId
      : this.currentStoreId ?? this.selectedStoreId ?? (this.tasks.length ? this.tasks[0].prodavnicaId : undefined);

    if (!targetStoreId) {
      Swal.fire('Informacija', 'Nismo uspjeli odrediti prodavnicu za kreiranje zadatka. Molimo pokušajte ponovo nakon osvježavanja.', 'info');
      return;
    }

    const dialogRef = this.dialogService.open(CustomTaskDialogComponent, {
      context: {
        title: 'Novi zadatak',
        date: new Date(),
        imageAllowed: true,
        allowBulk: this.canBulkCreate,
        stores: this.stores,
        defaultStoreId: targetStoreId
      }
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((payload: DailyTaskPayload | DailyTaskBulkPayload | null) => {
      if (!payload) {
        return;
      }

      if (this.canBulkCreate && 'targetType' in payload) {
        this.dailyTaskService.createBulkCustomTask(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (result) => {
              Swal.fire('Uspjeh', `Kreirano ${result.brojZadataka} zadataka za ${result.brojProdavnica} prodavnica.`, 'success');
              this.refreshTasks();
              this.refreshHistory();
            },
            error: (err) => {
              const poruka = err.error?.poruka ?? err.statusText;
              Swal.fire('Greška', `Greška prilikom spremanja zadatka: ${poruka}`, 'error');
            }
          });
      } else {
        this.dailyTaskService.createCustomTask(targetStoreId as number, payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (task) => {
              this.tasks.push(task);
              this.updateDerivedCollections();
              this.refreshHistory();
            },
            error: (err) => {
              const poruka = err.error?.poruka ?? err.statusText;
              Swal.fire('Greška', `Greška prilikom spremanja zadatka: ${poruka}`, 'error');
            }
          });
      }
    });
  }

  editCustomTask(task: DailyTask): void {
    const dialogRef = this.dialogService.open(CustomTaskDialogComponent, {
      context: {
        title: 'Uredi zadatak',
        task
      }
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((payload) => {
      if (!payload) {
        return;
      }

      this.dailyTaskService.updateCustomTask(task.id, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updated) => this.replaceTask(updated),
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom ažuriranja zadatka: ${poruka}`, 'error');
          }
        });
    });
  }

  trackByTaskId(_: number, task: DailyTask): number {
    return task.id;
  }

  private loadInitialData(): void {
    this.initHistoryDates();
    if (this.canManageStores) {
      this.dailyTaskService.getStores()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (stores) => {
            this.stores = stores;
            if (stores.length > 0) {
              this.selectedStoreId = stores[0].id;
              this.historyStoreId = null;
              this.refreshTasks();
              this.refreshHistory();
            }
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom učitavanja prodavnica: ${poruka}`, 'error');
          }
        });
    } else {
      if (this.currentStoreId && !this.selectedStoreId) {
        this.selectedStoreId = this.currentStoreId;
      }
      this.historyStoreId = this.selectedStoreId ?? this.currentStoreId ?? null;
      this.refreshTasks();
      this.refreshHistory();
    }
  }

  private replaceTask(task: DailyTask): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      this.tasks[index] = task;
    } else {
      this.tasks.push(task);
    }
    this.updateDerivedCollections();
  }

  private updateDerivedCollections(): void {
    this.repetitiveTasks = this.tasks.filter(t => t.type === this.repetitiveType);
    this.customTasks = this.tasks.filter(t => t.type === this.customType);

    const completed = this.tasks.filter(t => t.status === 'DONE').length;
    const inProgress = this.tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const open = this.tasks.filter(t => t.status === 'OPEN').length;
    const recurringCount = this.repetitiveTasks.length;
    const personalRecurring = this.tasks.filter(t => t.isRecurring).length;

    this.summaryCards = [
      {
        title: 'Aktivni zadaci',
        subtitle: 'Otvoreni i u toku',
        value: open + inProgress,
        icon: 'flash-outline',
        accent: 'info'
      },
      {
        title: 'Završeno danas',
        subtitle: 'Zadaci označeni kao završeni',
        value: completed,
        icon: 'checkmark-outline',
        accent: 'success'
      },
      {
        title: 'Ponavljajući ritam',
        subtitle: personalRecurring
          ? `Vaših personalnih zadataka: ${personalRecurring}`
          : 'Dodajte vlastiti tempo',
        value: recurringCount,
        icon: 'calendar-outline',
        accent: 'primary'
      }
    ];

    this.statusChartData = [
      { name: this.statusLabelMap.OPEN, value: open },
      { name: this.statusLabelMap.IN_PROGRESS, value: inProgress },
      { name: this.statusLabelMap.DONE, value: completed }
    ].filter(item => item.value > 0);
  }

  downloadReport(): void {
    if (!this.historyFrom || !this.historyTo) {
      return;
    }

    this.reportLoading = true;
    const storeId = this.canManageStores ? this.historyStoreId ?? undefined : undefined;
    const status = this.historyStatus !== 'ALL' ? this.historyStatus : undefined;
    const type = this.historyType !== 'ALL' ? this.historyType : undefined;

    this.dailyTaskService.downloadReport({
      storeId,
      from: this.historyFrom,
      to: this.historyTo,
      status,
      type
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `daily-tasks-report-${this.historyFrom}-${this.historyTo}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.reportLoading = false;
        },
        error: (err) => {
          this.reportLoading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom preuzimanja reporta: ${poruka}`, 'error');
        }
      });
  }

  private initHistoryDates(): void {
    if (this.historyFrom && this.historyTo) {
      return;
    }

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);

    this.historyFrom = from.toISOString().substring(0, 10);
    this.historyTo = to.toISOString().substring(0, 10);
  }
}
