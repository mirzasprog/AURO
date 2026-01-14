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
    repeatDays: [0]
  });

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
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
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

    this.dialogRef.close({ payload, repeatDays: Number(value.repeatDays) || 0 });
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
}
