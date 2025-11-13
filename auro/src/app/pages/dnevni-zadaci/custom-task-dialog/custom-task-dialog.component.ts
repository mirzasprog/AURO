import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DailyTask, DailyTaskPayload } from '../../../@core/data/daily-task';

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

  form: FormGroup;

  constructor(
    protected readonly dialogRef: NbDialogRef<CustomTaskDialogComponent>,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      imageAllowed: [true],
      isRecurring: [false]
    });
  }

  ngOnInit(): void {
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
        imageAllowed: this.imageAllowed
      });
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

    this.dialogRef.close(payload);
  }
}
