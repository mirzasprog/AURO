import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { ShiftDto, ShiftEmployee, ShiftCreateRequest } from '../../../@core/data/shifts';
import { DailyTaskStore } from '../../../@core/data/daily-task';

interface ShiftFormContext {
  title: string;
  shift?: ShiftDto;
  employees: ShiftEmployee[];
  stores: DailyTaskStore[];
  shiftTypes: string[];
  shiftStatuses: string[];
  storeId?: number;
  canSelectStore: boolean;
}

type EmployeeShiftChoice = 'first' | 'second' | 'custom' | null;

interface EmployeeShiftSelection {
  employee: ShiftEmployee;
  choice: EmployeeShiftChoice;
  customStartDate?: string | null;
  customEndDate?: string | null;
  customStartTime?: string | null;
  customEndTime?: string | null;
}

@Component({
  selector: 'ngx-shift-form-dialog',
  templateUrl: './shift-form-dialog.component.html',
  styleUrls: ['./shift-form-dialog.component.scss']
})
export class ShiftFormDialogComponent {
  title: string;
  shift?: ShiftDto;
  employees: ShiftEmployee[];
  stores: DailyTaskStore[];
  shiftTypes: string[];
  shiftStatuses: string[];
  storeId?: number;
  canSelectStore: boolean;
  readonly form = this.fb.group({
    storeId: [this.context.storeId ?? this.context.shift?.storeId ?? 0, this.context.canSelectStore ? Validators.required : []],
    employeeId: [this.context.shift?.employeeId ?? null, Validators.required],
    shiftDate: [this.formatDateInput(this.context.shift?.shiftDate), Validators.required],
    startTime: [this.formatTimeInput(this.context.shift?.startTime), Validators.required],
    endTime: [this.formatTimeInput(this.context.shift?.endTime), Validators.required],
    breakMinutes: [this.context.shift?.breakMinutes ?? 0, [Validators.min(0)]],
    shiftType: [this.context.shift?.shiftType ?? this.context.shiftTypes?.[0] ?? '', Validators.required],
    departmentId: [this.context.shift?.departmentId ?? null],
    status: [this.context.shift?.status ?? 'Draft', Validators.required],
    note: [this.context.shift?.note ?? ''],
  });
  readonly bulkForm = this.fb.group({
    storeId: [this.context.storeId ?? this.context.stores?.[0]?.id ?? null, Validators.required],
    startDate: [this.formatDateInput(), Validators.required],
    endDate: [this.formatDateInput(), Validators.required],
    firstStart: ['08:00', Validators.required],
    firstEnd: ['16:00', Validators.required],
    secondStart: ['16:00', Validators.required],
    secondEnd: ['23:00', Validators.required],
  });
  employeeSelections: EmployeeShiftSelection[] = [];
  pageSize = 5;
  currentPage = 1;
  validationMessage = '';
  minDate = '';
  maxDate = '';

  constructor(
    private readonly dialogRef: NbDialogRef<ShiftFormDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(NB_DIALOG_CONFIG) public context: ShiftFormContext
  ) {
    this.title = context.title;
    this.shift = context.shift;
    this.employees = context.employees;
    this.stores = context.stores;
    this.shiftTypes = context.shiftTypes;
    this.shiftStatuses = context.shiftStatuses;
    this.storeId = context.storeId;
    this.canSelectStore = context.canSelectStore;
    const today = new Date();
    this.minDate = this.formatDate(today);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 10);
    this.maxDate = this.formatDate(maxDate);
    this.employeeSelections = this.employees.map((employee) => ({
      employee,
      choice: null,
      customStartDate: this.formatDate(today),
      customEndDate: this.formatDate(today),
      customStartTime: '',
      customEndTime: '',
    }));
  }

  get isEditMode(): boolean {
    return Boolean(this.shift);
  }

  get pagedEmployees(): EmployeeShiftSelection[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employeeSelections.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.employeeSelections.length / this.pageSize));
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.isEditMode) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const value = this.form.value;
      const payload: ShiftCreateRequest = {
        storeId: Number(value.storeId),
        employeeId: Number(value.employeeId),
        shiftDate: String(value.shiftDate),
        startTime: this.normalizeTime(String(value.startTime)),
        endTime: this.normalizeTime(String(value.endTime)),
        breakMinutes: Number(value.breakMinutes) || 0,
        shiftType: String(value.shiftType),
        departmentId: value.departmentId ? Number(value.departmentId) : null,
        status: String(value.status),
        note: value.note ? String(value.note) : null
      };

      this.dialogRef.close({ payload });
      return;
    }

    if (this.bulkForm.invalid) {
      this.bulkForm.markAllAsTouched();
      return;
    }

    this.validationMessage = '';
    const bulkValue = this.bulkForm.value;
    const storeId = Number(bulkValue.storeId);
    const headerStartDate = String(bulkValue.startDate);
    const headerEndDate = String(bulkValue.endDate);
    const firstStart = this.normalizeTime(String(bulkValue.firstStart));
    const firstEnd = this.normalizeTime(String(bulkValue.firstEnd));
    const secondStart = this.normalizeTime(String(bulkValue.secondStart));
    const secondEnd = this.normalizeTime(String(bulkValue.secondEnd));

    const headerRangeValidation = this.validateRange(headerStartDate, headerEndDate);
    if (headerRangeValidation) {
      this.validationMessage = headerRangeValidation;
      return;
    }

    if (!this.isTimeRangeValid(firstStart, firstEnd)) {
      this.validationMessage = 'Unesite ispravan period za prvu smjenu.';
      return;
    }

    if (!this.isTimeRangeValid(secondStart, secondEnd)) {
      this.validationMessage = 'Unesite ispravan period za drugu smjenu.';
      return;
    }

    const selections = this.employeeSelections.filter((item) => item.choice);
    if (!selections.length) {
      this.validationMessage = 'Odaberite barem jednog uposlenika.';
      return;
    }

    const payloads: ShiftCreateRequest[] = [];
    for (const selection of selections) {
      if (this.validationMessage) {
        break;
      }
      const { employee, choice } = selection;
      if (!choice) {
        continue;
      }

      if (choice === 'custom') {
        const customStartDate = selection.customStartDate ? String(selection.customStartDate) : '';
        const customEndDate = selection.customEndDate ? String(selection.customEndDate) : '';
        const customStartTime = selection.customStartTime ? this.normalizeTime(String(selection.customStartTime)) : '';
        const customEndTime = selection.customEndTime ? this.normalizeTime(String(selection.customEndTime)) : '';

        if (!customStartDate || !customEndDate || !customStartTime || !customEndTime) {
          this.validationMessage = `Popunite sve podatke za custom smjenu (${employee.employeeName}).`;
          continue;
        }

        const customRangeValidation = this.validateRange(customStartDate, customEndDate);
        if (customRangeValidation) {
          this.validationMessage = customRangeValidation;
          continue;
        }

        if (!this.isTimeRangeValid(customStartTime, customEndTime)) {
          this.validationMessage = `Unesite ispravan period za custom smjenu (${employee.employeeName}).`;
          continue;
        }

        this.getDateRange(customStartDate, customEndDate).forEach((date) => {
          payloads.push({
            storeId,
            employeeId: employee.employeeId,
            shiftDate: date,
            startTime: customStartTime,
            endTime: customEndTime,
            breakMinutes: 0,
            shiftType: this.resolveShiftType('custom'),
            departmentId: null,
            status: 'Draft',
            note: null
          });
        });
        continue;
      }

      const dates = this.getDateRange(headerStartDate, headerEndDate);
      const shiftType = choice === 'first' ? this.resolveShiftType('first') : this.resolveShiftType('second');
      const startTime = choice === 'first' ? firstStart : secondStart;
      const endTime = choice === 'first' ? firstEnd : secondEnd;
      dates.forEach((date) => {
        payloads.push({
          storeId,
          employeeId: employee.employeeId,
          shiftDate: date,
          startTime,
          endTime,
          breakMinutes: 0,
          shiftType,
          departmentId: null,
          status: 'Draft',
          note: null
        });
      });
    }

    if (!payloads.length) {
      this.validationMessage = 'Nismo uspjeli pripremiti smjene. Provjerite unos.';
      return;
    }

    if (this.validationMessage) {
      return;
    }

    this.dialogRef.close({ payloads });
  }

  selectChoice(selection: EmployeeShiftSelection, choice: EmployeeShiftChoice): void {
    selection.choice = choice;
    if (choice === 'custom') {
      if (!selection.customStartDate) {
        selection.customStartDate = String(this.bulkForm.value.startDate ?? this.minDate);
      }
      if (!selection.customEndDate) {
        selection.customEndDate = String(this.bulkForm.value.endDate ?? this.minDate);
      }
      if (!selection.customStartTime) {
        selection.customStartTime = String(this.bulkForm.value.firstStart ?? '08:00');
      }
      if (!selection.customEndTime) {
        selection.customEndTime = String(this.bulkForm.value.firstEnd ?? '16:00');
      }
      return;
    }
    selection.customStartDate = null;
    selection.customEndDate = null;
    selection.customStartTime = null;
    selection.customEndTime = null;
  }

  previousPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  private normalizeTime(time: string): string {
    if (time.length === 5) {
      return `${time}:00`;
    }
    return time;
  }

  private formatDateInput(date?: string | null): string {
    if (!date) {
      const today = new Date();
      return this.formatDate(today);
    }
    return this.formatDate(new Date(date));
  }

  private formatTimeInput(time?: string | null): string {
    if (!time) {
      return '08:00';
    }
    return time.substring(0, 5);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private validateRange(start: string, end: string): string | null {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);
    if (!startDate || !endDate) {
      return 'Odaberite ispravan datum.';
    }
    if (startDate > endDate) {
      return 'Datum do ne može biti prije datuma od.';
    }
    const minDate = this.parseDate(this.minDate);
    const maxDate = this.parseDate(this.maxDate);
    if (!minDate || !maxDate) {
      return null;
    }
    if (startDate < minDate || endDate > maxDate) {
      return 'Možete unositi smjene najviše 10 dana unaprijed.';
    }
    const days = this.calculateDays(startDate, endDate);
    if (days < 1 || days > 10) {
      return 'Raspon datuma može imati najviše 10 dana.';
    }
    return null;
  }

  private parseDate(value: string): Date | null {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private calculateDays(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  }

  private getDateRange(start: string, end: string): string[] {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);
    if (!startDate || !endDate) {
      return [];
    }
    const dates: string[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      dates.push(this.formatDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  private resolveShiftType(kind: 'first' | 'second' | 'custom'): string {
    const fallback = kind === 'first'
      ? this.shiftTypes?.[0] ?? 'Morning'
      : kind === 'second'
        ? this.shiftTypes?.[1] ?? 'Afternoon'
        : 'Custom';
    if (kind === 'custom') {
      return this.shiftTypes?.find((type) => type.toLowerCase() === 'custom') ?? fallback;
    }
    if (kind === 'first') {
      return this.shiftTypes?.find((type) => type.toLowerCase() === 'morning') ?? fallback;
    }
    return this.shiftTypes?.find((type) => type.toLowerCase() === 'afternoon') ?? fallback;
  }

  private isTimeRangeValid(start: string, end: string): boolean {
    if (!start || !end) {
      return false;
    }
    return start < end;
  }
}
