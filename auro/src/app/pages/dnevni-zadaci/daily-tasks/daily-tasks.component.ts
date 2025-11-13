import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DailyTask, DailyTaskStore } from '../../../@core/data/daily-task';
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
  stores: DailyTaskStore[] = [];
  selectedStoreId?: number;
  loading = false;
  role: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: NbAuthService,
    private readonly dailyTaskService: DailyTaskService,
    private readonly dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.authService.getToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe((token: NbAuthJWTToken) => {
        this.role = token.getPayload()?.['role'] ?? null;
        this.loadInitialData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canManageCustomTasks(): boolean {
    return this.role === 'podrucni' || this.role === 'regionalni';
  }

  get isStoreSelected(): boolean {
    return !this.canManageCustomTasks || !!this.selectedStoreId;
  }

  onStoreChange(): void {
    this.refreshTasks();
  }

  refreshTasks(): void {
    if (!this.isStoreSelected) {
      return;
    }

    this.loading = true;
    const storeId = this.canManageCustomTasks ? this.selectedStoreId : undefined;
    this.dailyTaskService.getTodayTasks(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.repetitiveTasks = tasks.filter(t => t.type === this.repetitiveType);
          this.customTasks = tasks.filter(t => t.type === this.customType);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Greška prilikom preuzimanja zadataka: ${poruka}`, 'error');
        }
      });
  }

  openTask(task: DailyTask): void {
    const dialogRef = this.dialogService.open(TaskDetailDialogComponent, {
      context: {
        task,
        canEdit: this.canManageCustomTasks || this.role === 'prodavnica'
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
    if (!this.selectedStoreId) {
      return;
    }

    const dialogRef = this.dialogService.open(CustomTaskDialogComponent, {
      context: {
        title: 'Novi zadatak',
        date: new Date(),
        imageAllowed: true
      }
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((payload) => {
      if (!payload) {
        return;
      }

      this.dailyTaskService.createCustomTask(this.selectedStoreId as number, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (task) => {
            this.tasks.push(task);
            this.customTasks = this.tasks.filter(t => t.type === this.customType);
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom spremanja zadatka: ${poruka}`, 'error');
          }
        });
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
    if (this.canManageCustomTasks) {
      this.dailyTaskService.getStores()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (stores) => {
            this.stores = stores;
            if (stores.length > 0) {
              this.selectedStoreId = stores[0].id;
              this.refreshTasks();
            }
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Greška prilikom učitavanja prodavnica: ${poruka}`, 'error');
          }
        });
    } else {
      this.refreshTasks();
    }
  }

  private replaceTask(task: DailyTask): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      this.tasks[index] = task;
    } else {
      this.tasks.push(task);
    }
    this.repetitiveTasks = this.tasks.filter(t => t.type === this.repetitiveType);
    this.customTasks = this.tasks.filter(t => t.type === this.customType);
  }
}
