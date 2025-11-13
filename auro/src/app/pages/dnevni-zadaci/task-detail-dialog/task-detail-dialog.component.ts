import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import Swal from 'sweetalert2';
import { DailyTask, DailyTaskStatus } from '../../../@core/data/daily-task';
import { DailyTaskService } from '../../../@core/utils/daily-task.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.scss']
})
export class TaskDetailDialogComponent implements OnInit {
  @Input() task!: DailyTask;
  @Input() canEdit = false;

  form: FormGroup;
  selectedFile?: File;
  removeImage = false;
  submitting = false;

  readonly statusOptions: { label: string; value: DailyTaskStatus }[] = [
    { label: 'Otvoren', value: 'OPEN' },
    { label: 'U toku', value: 'IN_PROGRESS' },
    { label: 'Završen', value: 'DONE' }
  ];

  constructor(
    protected readonly dialogRef: NbDialogRef<TaskDetailDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly dailyTaskService: DailyTaskService
  ) {
    this.form = this.fb.group({
      status: ['OPEN', Validators.required],
      completionNote: ['']
    });
  }

  ngOnInit(): void {
    if (!this.task) {
      return;
    }

    this.form.patchValue({
      status: this.task.status,
      completionNote: this.task.completionNote ?? ''
    });
  }

  get imageUrl(): string | null {
    if (!this.task?.imageAttachment) {
      return null;
    }

    if (this.task.imageAttachment.startsWith('http')) {
      return this.task.imageAttachment;
    }

    return `${environment.apiUrl}/${this.task.imageAttachment}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      this.selectedFile = undefined;
      return;
    }

    this.selectedFile = input.files[0];
    this.removeImage = false;
  }

  markImageForRemoval(): void {
    this.selectedFile = undefined;
    this.removeImage = true;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (!this.canEdit) {
      this.dialogRef.close();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { status, completionNote } = this.form.value;
    if (status === 'DONE' && (!completionNote || !completionNote.trim())) {
      Swal.fire('Napomena', 'Molimo unesite napomenu prije označavanja zadatka kao završenog.', 'warning');
      return;
    }

    this.submitting = true;
    this.dailyTaskService.updateTaskStatus(this.task.id, {
      status,
      completionNote,
      image: this.selectedFile ?? null,
      removeImage: this.removeImage
    }).subscribe({
      next: (updated) => {
        this.submitting = false;
        Swal.fire('Uspjeh', 'Zadatak je uspješno ažuriran.', 'success');
        this.dialogRef.close(updated);
      },
      error: (err) => {
        this.submitting = false;
        const poruka = err.error?.poruka ?? err.statusText;
        Swal.fire('Greška', `Greška prilikom ažuriranja zadatka: ${poruka}`, 'error');
      }
    });
  }
}
