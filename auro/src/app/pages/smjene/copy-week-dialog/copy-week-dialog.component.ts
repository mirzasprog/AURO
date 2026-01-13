import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { ShiftCopyWeekRequest } from '../../../@core/data/shifts';

interface CopyWeekContext {
  weekStart: Date;
}

@Component({
  selector: 'ngx-copy-week-dialog',
  templateUrl: './copy-week-dialog.component.html',
  styleUrls: ['./copy-week-dialog.component.scss']
})
export class CopyWeekDialogComponent {
  weekStart: Date;
  readonly form = this.fb.group({
    sourceWeekStart: [this.formatDateInput(this.context.weekStart), Validators.required],
    targetWeekStart: ['', Validators.required],
    overwrite: [false]
  });

  constructor(
    private readonly dialogRef: NbDialogRef<CopyWeekDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(NB_DIALOG_CONFIG) public context: CopyWeekContext
  ) {
    this.weekStart = context.weekStart;
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
    const payload: ShiftCopyWeekRequest = {
      storeId: 0,
      sourceWeekStart: String(value.sourceWeekStart),
      targetWeekStart: String(value.targetWeekStart),
      overwrite: Boolean(value.overwrite)
    };

    this.dialogRef.close(payload);
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
