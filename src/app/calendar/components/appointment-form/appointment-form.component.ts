import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgIf} from '@angular/common';
import {AppointmentData} from '../../entity/appointment.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, ReactiveFormsModule, MatDatepickerModule, NgIf]
})
export class AppointmentFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  data: AppointmentData = inject(MAT_DIALOG_DATA);
  appointmentForm = new FormGroup({
    title: new FormControl<string>(this.data?.title || '', Validators.required),
    date: new FormControl<Date>(this.data?.date || this.data.date || new Date(), Validators.required),
    startTime: new FormControl<string>(this.data?.startTime || '', Validators.required),
    endTime: new FormControl<string>(this.data?.endTime || '', Validators.required),
    description: new FormControl<string>(this.data?.description || ''),
  }, {validators: this.endTimeAfterStartTimeValidator});

  ngOnInit(): void {
    this.appointmentForm.get('startTime')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((startTime) => {
      if (startTime) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const duration = 60;

        const endDate = new Date();
        endDate.setHours(startHours, startMinutes + duration);

        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
        const endTime = `${endHours}:${endMinutes}`;

        const currentEndTime = this.appointmentForm.get('endTime')?.value;
        if (!currentEndTime || currentEndTime <= startTime) {
          this.appointmentForm.get('endTime')?.setValue(endTime);
        }
      }
    });
  }

  endTimeAfterStartTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime: string = control.get('startTime')?.value;
    const endTime: string = control.get('endTime')?.value;
    return startTime && endTime && endTime <= startTime ? { 'endTimeBeforeStartTime': true } : null;
  };

  save(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
