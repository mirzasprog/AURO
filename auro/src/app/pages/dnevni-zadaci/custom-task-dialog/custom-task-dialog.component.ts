import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DailyTask, DailyTaskBulkPayload, DailyTaskPayload, DailyTaskStore } from '../../../@core/data/daily-task';

@Component({
  selector: 'ngx-custom-task-dialog',
  templateUrl: './custom-task-dialog.component.html',
  styleUrls: ['./custom-task-dialog.component.scss']
})
export class CustomTaskDialogComponent implements OnInit {
  @Input() title = 'Prilagođeni zadatak';
  @Input() task?: DailyTask;
  @Input() date?: Date;
  @Input() imageAllowed = true;
  @Input() allowBulk = false;
  @Input() stores: DailyTaskStore[] = [];
  @Input() defaultStoreId?: number;

  form: FormGroup;
  targetModes = [
    { value: 'stores', label: 'Odabrane prodavnice' },
    { value: 'city', label: 'Po gradu' },
    { value: 'manager', label: 'Po područnom voditelju' },
    { value: 'format', label: 'Po formatu prodavnice' }
  ];
  cityOptions: string[] = [];
  formatOptions: string[] = [];
  managerOptions: { id: number; label: string }[] = [];

  constructor(
    protected readonly dialogRef: NbDialogRef<CustomTaskDialogComponent>,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      imageAllowed: [true],
      isRecurring: [false],
      targetMode: ['stores'],
      storeIds: [[]],
      city: [''],
      managerId: [null],
      format: ['']
    });
  }

  ngOnInit(): void {
    if (this.allowBulk) {
      this.initTargetOptions();
    }

    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        date: this.task.date ? this.task.date.substring(0, 10) : '',
        imageAllowed: this.task.imageAllowed,
        isRecurring: this.task.isRecurring
      });
    } else if (this.date) {
      const formatted = this.date.toISOString().substring(0, 10);
      this.form.patchValue({
        date: formatted,
        imageAllowed: this.imageAllowed,
        targetMode: this.allowBulk ? 'stores' : 'stores'
      });
      if (this.defaultStoreId) {
        this.form.patchValue({
          storeIds: [this.defaultStoreId]
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const payload: DailyTaskPayload = {
      title: value.title,
      description: value.description,
      date: value.date,
      imageAllowed: value.imageAllowed,
      isRecurring: value.isRecurring
    };

    if (this.allowBulk) {
      const targetMode = value.targetMode;
      if (targetMode === 'stores' && (!value.storeIds || value.storeIds.length === 0)) {
        this.form.get('storeIds')?.setErrors({ required: true });
        return;
      }
      if (targetMode === 'city' && !value.city) {
        this.form.get('city')?.setErrors({ required: true });
        return;
      }
      if (targetMode === 'manager' && !value.managerId) {
        this.form.get('managerId')?.setErrors({ required: true });
        return;
      }
      if (targetMode === 'format' && !value.format) {
        this.form.get('format')?.setErrors({ required: true });
        return;
      }

      const bulkPayload: DailyTaskBulkPayload = {
        ...payload,
        targetType: targetMode,
        storeIds: value.storeIds,
        city: value.city,
        managerId: value.managerId,
        format: value.format
      };

      this.dialogRef.close(bulkPayload);
      return;
    }

    this.dialogRef.close(payload);
  }

  private initTargetOptions(): void {
    const cities = new Set<string>();
    const formats = new Set<string>();
    const managers = new Map<number, string>();

    this.stores.forEach(store => {
      if (store.city) {
        cities.add(store.city);
      }
      if (store.format) {
        formats.add(store.format);
      }
      if (store.managerId) {
        managers.set(store.managerId, store.managerName ?? `Voditelj ${store.managerId}`);
      }
    });

    this.cityOptions = Array.from(cities).sort();
    this.formatOptions = Array.from(formats).sort();
    this.managerOptions = Array.from(managers.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
