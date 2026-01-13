import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DailyTaskStore } from '../../@core/data/daily-task';
import { ShiftCopyWeekRequest, ShiftDto, ShiftEmployee, ShiftMutationResponse, ShiftPublishRequest, ShiftRequestDto } from '../../@core/data/shifts';
import { DailyTaskService } from '../../@core/utils/daily-task.service';
import { ShiftsService } from '../../@core/utils/shifts.service';
import { CopyWeekDialogComponent } from './copy-week-dialog/copy-week-dialog.component';
import { PublishDialogComponent } from './publish-dialog/publish-dialog.component';
import { ShiftFormDialogComponent } from './shift-form-dialog/shift-form-dialog.component';

interface WeeklyEmployeeRow {
  employeeId: number;
  employeeName: string;
  shiftsByDay: Record<string, ShiftDto[]>;
}

@Component({
  selector: 'ngx-smjene',
  templateUrl: './smjene.component.html',
  styleUrls: ['./smjene.component.scss']
})
export class SmjeneComponent implements OnInit, OnDestroy {
  stores: DailyTaskStore[] = [];
  employees: ShiftEmployee[] = [];
  shifts: ShiftDto[] = [];
  monthShifts: ShiftDto[] = [];
  requests: ShiftRequestDto[] = [];
  selectedStoreId?: number;
  currentStoreId?: number;
  weekStart = this.getWeekStart(new Date());
  weekPicker = '';
  selectedDay = new Date();
  employeeSearch = '';
  departmentFilter = '';
  statusFilter = '';
  loading = false;
  monthLoading = false;
  requestsLoading = false;
  role: string | null = null;
  exportFormat: 'xlsx' | 'csv' = 'xlsx';

  private destroy$ = new Subject<void>();

  readonly shiftTypes = ['Morning', 'Afternoon', 'Night', 'Custom'];
  readonly shiftStatuses = ['Draft', 'Published', 'Completed', 'Cancelled'];

  constructor(
    private readonly authService: NbAuthService,
    private readonly dialogService: NbDialogService,
    private readonly dailyTaskService: DailyTaskService,
    private readonly shiftsService: ShiftsService,
  ) {}

  ngOnInit(): void {
    this.weekPicker = this.formatDateInput(this.weekStart);
    this.selectedDay = new Date(this.weekStart);
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
        this.loadStores();
        this.loadEmployees();
        this.loadShifts();
        this.loadRequests();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get canManageStores(): boolean {
    return this.role !== 'prodavnica';
  }

  get canManageRequests(): boolean {
    return this.role !== 'prodavnica';
  }

  get weekDays(): Date[] {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(this.weekStart);
      day.setDate(this.weekStart.getDate() + index);
      return day;
    });
  }

  get weeklyRows(): WeeklyEmployeeRow[] {
    const filtered = this.filteredShifts;
    const grouped = new Map<number, WeeklyEmployeeRow>();
    filtered.forEach((shift) => {
      const employeeId = shift.employeeId;
      const employeeName = shift.employeeName || `#${shift.employeeId}`;
      if (!grouped.has(employeeId)) {
        grouped.set(employeeId, { employeeId, employeeName, shiftsByDay: {} });
      }
      const row = grouped.get(employeeId)!;
      const key = this.formatDateInput(new Date(shift.shiftDate));
      if (!row.shiftsByDay[key]) {
        row.shiftsByDay[key] = [];
      }
      row.shiftsByDay[key].push(shift);
    });
    return Array.from(grouped.values()).sort((a, b) => a.employeeName.localeCompare(b.employeeName));
  }

  get filteredShifts(): ShiftDto[] {
    return this.shifts.filter((shift) => {
      if (this.statusFilter && shift.status !== this.statusFilter) {
        return false;
      }
      if (this.departmentFilter && String(shift.departmentId ?? '') !== this.departmentFilter) {
        return false;
      }
      if (this.employeeSearch) {
        const query = this.employeeSearch.toLowerCase();
        const name = (shift.employeeName ?? '').toLowerCase();
        return name.includes(query) || String(shift.employeeId).includes(query);
      }
      return true;
    });
  }

  get dailyShifts(): ShiftDto[] {
    const dayKey = this.formatDateInput(this.selectedDay);
    return this.filteredShifts.filter((shift) => this.formatDateInput(new Date(shift.shiftDate)) === dayKey);
  }

  get monthSummary(): { date: string; count: number }[] {
    const summary = new Map<string, number>();
    this.monthShifts.forEach((shift) => {
      const dateKey = this.formatDateInput(new Date(shift.shiftDate));
      summary.set(dateKey, (summary.get(dateKey) ?? 0) + 1);
    });
    return Array.from(summary.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get departments(): string[] {
    const ids = new Set<string>();
    this.shifts.forEach((shift) => {
      if (shift.departmentId !== null && shift.departmentId !== undefined) {
        ids.add(String(shift.departmentId));
      }
    });
    return Array.from(ids.values()).sort();
  }

  onWeekChange(value: string): void {
    if (!value) {
      return;
    }
    const selected = new Date(value);
    this.weekStart = this.getWeekStart(selected);
    this.weekPicker = this.formatDateInput(this.weekStart);
    this.selectedDay = new Date(this.weekStart);
    this.loadShifts();
  }

  onDayChange(value: string): void {
    if (value) {
      this.selectedDay = new Date(value);
    }
  }

  onStoreChange(): void {
    this.loadEmployees();
    this.loadShifts();
    this.loadRequests();
  }

  loadStores(): void {
    if (!this.canManageStores) {
      return;
    }

    this.dailyTaskService.getStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stores) => {
          this.stores = stores;
          if (!this.selectedStoreId && stores.length) {
            this.selectedStoreId = stores[0].id;
          }
        },
        error: () => {
          Swal.fire('Greška', 'Ne možemo preuzeti listu prodavnica.', 'error');
        }
      });
  }

  loadEmployees(): void {
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    this.shiftsService.getEmployees(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => this.employees = employees,
        error: (err) => {
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo preuzeti zaposlenike: ${poruka}`, 'error');
        }
      });
  }

  loadShifts(): void {
    this.loading = true;
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    const from = this.formatDateInput(this.weekStart);
    const to = this.formatDateInput(this.weekDays[this.weekDays.length - 1]);

    this.shiftsService.getShifts({ storeId, from, to, status: this.statusFilter || undefined, pageSize: 500 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.shifts = result.items || [];
          if (!this.canManageStores && this.shifts.length && !this.currentStoreId) {
            this.currentStoreId = this.shifts[0].storeId;
            this.selectedStoreId = this.selectedStoreId ?? this.currentStoreId;
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo preuzeti smjene: ${poruka}`, 'error');
        }
      });
  }

  loadMonthShifts(): void {
    if (this.monthLoading) {
      return;
    }
    this.monthLoading = true;
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    const monthStart = new Date(this.weekStart.getFullYear(), this.weekStart.getMonth(), 1);
    const monthEnd = new Date(this.weekStart.getFullYear(), this.weekStart.getMonth() + 1, 0);

    this.shiftsService.getShifts({ storeId, from: this.formatDateInput(monthStart), to: this.formatDateInput(monthEnd), pageSize: 500 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.monthShifts = result.items || [];
          this.monthLoading = false;
        },
        error: (err) => {
          this.monthLoading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo preuzeti mjesečni pregled: ${poruka}`, 'error');
        }
      });
  }

  loadRequests(): void {
    if (!this.canManageRequests && !this.canManageStores) {
      return;
    }
    this.requestsLoading = true;
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    this.shiftsService.getRequests({ storeId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.requestsLoading = false;
        },
        error: (err) => {
          this.requestsLoading = false;
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo preuzeti zahtjeve: ${poruka}`, 'error');
        }
      });
  }

  openAddShift(): void {
    if (!this.canManageStores && !this.currentStoreId) {
      Swal.fire('Informacija', 'Nismo uspjeli odrediti prodavnicu za kreiranje smjene.', 'info');
      return;
    }
    const dialogRef = this.dialogService.open(ShiftFormDialogComponent, {
      context: {
        title: 'Nova smjena',
        employees: this.employees,
        stores: this.stores,
        shiftTypes: this.shiftTypes,
        shiftStatuses: this.shiftStatuses,
        storeId: this.selectedStoreId ?? this.currentStoreId,
        canSelectStore: this.canManageStores,
      },
      closeOnBackdropClick: false,
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (!result) {
        return;
      }

      const { payload, repeatDays } = result;
      const payloads = this.expandRepeat(payload, repeatDays);
      if (!payloads.length) {
        return;
      }

      const requests = payloads.map((item) => this.shiftsService.createShift(item).pipe(catchError((err) => of({ error: err }))));

      forkJoin(requests)
        .pipe(takeUntil(this.destroy$))
        .subscribe((responses) => {
          const created: ShiftDto[] = [];
          const warnings: string[] = [];
          responses.forEach((response: any) => {
            if (response?.error) {
              const poruka = response.error?.error?.poruka ?? response.error?.statusText;
              Swal.fire('Greška', `Ne možemo kreirati smjenu: ${poruka}`, 'error');
              return;
            }
            const mutation = response as ShiftMutationResponse;
            if (mutation.shift) {
              created.push(mutation.shift);
            }
            if (mutation.warning) {
              warnings.push(mutation.warning);
            }
          });

          if (created.length) {
            this.shifts = [...this.shifts, ...created];
            this.loadShifts();
          }

          if (warnings.length) {
            Swal.fire('Upozorenje', warnings.join('\n'), 'warning');
          }
        });
    });
  }

  openEditShift(shift: ShiftDto): void {
    const dialogRef = this.dialogService.open(ShiftFormDialogComponent, {
      context: {
        title: 'Uredi smjenu',
        shift,
        employees: this.employees,
        stores: this.stores,
        shiftTypes: this.shiftTypes,
        shiftStatuses: this.shiftStatuses,
        storeId: shift.storeId,
        canSelectStore: this.canManageStores,
      },
      closeOnBackdropClick: false,
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (!result) {
        return;
      }

      this.shiftsService.updateShift(shift.shiftId, result.payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.replaceShift(response.shift);
            if (response.warning) {
              Swal.fire('Upozorenje', response.warning, 'warning');
            }
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Ne možemo ažurirati smjenu: ${poruka}`, 'error');
          }
        });
    });
  }

  deleteShift(shift: ShiftDto): void {
    Swal.fire({
      title: 'Obrisati smjenu?',
      text: 'Smjena će biti označena kao obrisana.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Obriši',
      cancelButtonText: 'Odustani',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.shiftsService.deleteShift(shift.shiftId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.shifts = this.shifts.filter((item) => item.shiftId !== shift.shiftId);
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Ne možemo obrisati smjenu: ${poruka}`, 'error');
          }
        });
    });
  }

  openCopyWeek(): void {
    if (!this.canManageStores && !this.currentStoreId) {
      Swal.fire('Informacija', 'Nismo uspjeli odrediti prodavnicu za kopiranje sedmice.', 'info');
      return;
    }
    const dialogRef = this.dialogService.open(CopyWeekDialogComponent, {
      context: { weekStart: this.weekStart },
      closeOnBackdropClick: false,
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((payload: ShiftCopyWeekRequest | null) => {
      if (!payload) {
        return;
      }

      payload.storeId = this.canManageStores ? (this.selectedStoreId ?? 0) : (this.currentStoreId ?? payload.storeId);

      this.shiftsService.copyWeek(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadShifts();
            Swal.fire('Uspjeh', 'Sedmica je kopirana.', 'success');
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Ne možemo kopirati sedmicu: ${poruka}`, 'error');
          }
        });
    });
  }

  openPublish(): void {
    if (!this.canManageStores && !this.currentStoreId) {
      Swal.fire('Informacija', 'Nismo uspjeli odrediti prodavnicu za objavu smjena.', 'info');
      return;
    }
    const dialogRef = this.dialogService.open(PublishDialogComponent, {
      context: { weekStart: this.weekStart },
      closeOnBackdropClick: false,
    });

    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe((payload: ShiftPublishRequest | null) => {
      if (!payload) {
        return;
      }

      payload.storeId = this.canManageStores ? (this.selectedStoreId ?? 0) : (this.currentStoreId ?? payload.storeId);

      this.shiftsService.publish(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadShifts();
            Swal.fire('Uspjeh', 'Smjene su objavljene.', 'success');
          },
          error: (err) => {
            const poruka = err.error?.poruka ?? err.statusText;
            Swal.fire('Greška', `Ne možemo objaviti smjene: ${poruka}`, 'error');
          }
        });
    });
  }

  exportShifts(): void {
    const storeId = this.canManageStores ? this.selectedStoreId : undefined;
    const from = this.formatDateInput(this.weekStart);
    const to = this.formatDateInput(this.weekDays[this.weekDays.length - 1]);
    this.shiftsService.exportShifts({ storeId, from, to, format: this.exportFormat })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `smjene.${this.exportFormat}`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo eksportovati smjene: ${poruka}`, 'error');
        }
      });
  }

  approveRequest(request: ShiftRequestDto): void {
    const managerNote = request.managerNote ?? '';
    this.shiftsService.approveRequest(request.requestId, { managerNote })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => this.replaceRequest(updated),
        error: (err) => {
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo odobriti zahtjev: ${poruka}`, 'error');
        }
      });
  }

  rejectRequest(request: ShiftRequestDto): void {
    const managerNote = request.managerNote ?? '';
    this.shiftsService.rejectRequest(request.requestId, { managerNote })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => this.replaceRequest(updated),
        error: (err) => {
          const poruka = err.error?.poruka ?? err.statusText;
          Swal.fire('Greška', `Ne možemo odbiti zahtjev: ${poruka}`, 'error');
        }
      });
  }

  onTabChange(event: { tabTitle?: string }): void {
    if (event.tabTitle === 'Mjesečni') {
      this.loadMonthShifts();
    }
  }

  private expandRepeat(payload: any, repeatDays: number): any[] {
    const days = Math.max(0, Number(repeatDays) || 0);
    if (!days) {
      return [payload];
    }
    const baseDate = new Date(payload.shiftDate);
    return Array.from({ length: days + 1 }, (_, index) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + index);
      return { ...payload, shiftDate: this.formatDateInput(date) };
    });
  }

  private replaceShift(updated: ShiftDto): void {
    this.shifts = this.shifts.map((item) => item.shiftId === updated.shiftId ? updated : item);
  }

  private replaceRequest(updated: ShiftRequestDto): void {
    this.requests = this.requests.map((item) => item.requestId === updated.requestId ? updated : item);
  }

  private getWeekStart(date: Date): Date {
    const copy = new Date(date);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(copy.setDate(diff));
  }

  formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
