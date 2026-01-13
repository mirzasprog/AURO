import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { ShiftPublishRequest } from '../../../@core/data/shifts';

interface PublishContext {
  weekStart: Date;
}

@Component({
  selector: 'ngx-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.scss']
})
export class PublishDialogComponent {
  readonly form = this.fb.group({
    from: [this.formatDateInput(this.context.weekStart), Validators.required],
    to: [this.formatDateInput(this.addDays(this.context.weekStart, 6)), Validators.required]
  });

  constructor(
    private readonly dialogRef: NbDialogRef<PublishDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(NB_DIALOG_CONFIG) public context: PublishContext
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const payload: ShiftPublishRequest = {
      storeId: 0,
      from: String(value.from),
      to: String(value.to)
    };

    this.dialogRef.close(payload);
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
