import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Appointment, AppointmentService, ValidTime } from '@services/appointment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;
  isEditMode: boolean;
  validTimes: ValidTime[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(
    private appointmentService: AppointmentService,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {
    this.isEditMode = !!data.id;
    this.appointmentForm = new FormGroup(
      {
        title: new FormControl(this.data?.title || '', Validators.required),
        description: new FormControl(this.data?.description || ''),
        start: new FormControl(this.data?.start || '', Validators.required),
        end: new FormControl(this.data?.end || '', Validators.required),
        startTime: new FormControl(this.data?.startTime != null ? this.data.startTime : null, [
          Validators.required,
          Validators.min(0),
          Validators.max(23),
        ]),
        endTime: new FormControl(this.data?.endTime != null ? this.data.endTime : null, [
          Validators.required,
          Validators.min(0),
          Validators.max(23),
        ]),
      },
      { validators: this.timeRangeValidator }
    );
  }

  timeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('start')?.value;
    const endDate = group.get('end')?.value;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startDate && endDate && startTime != null && endTime != null) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(startTime, 0, 0, 0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(endTime, 0, 0, 0);

      return startDateTime < endDateTime ? null : { timeRangeInvalid: true };
    }
    return null;
  };

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const { title, description, start, end, startTime, endTime } = this.appointmentForm.value;

      const startDateTime = new Date(start);
      startDateTime.setHours(startTime, 0, 0, 0);

      const endDateTime = new Date(end);
      endDateTime.setHours(endTime, 0, 0, 0);

      const appointment: Appointment = {
        ...this.data,
        title,
        description,
        start: startDateTime,
        end: endDateTime,
        startTime,
        endTime,
        id: this.data?.id || this.generateId(),
      };
      this.dialogRef.close(appointment);
    }
  }

  onDelete(): void {
    this.appointmentService.deleteAppointment(this.data.id);
    this.dialogRef.close(false);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
