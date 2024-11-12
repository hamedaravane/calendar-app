import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgIf} from '@angular/common';

export interface AppointmentData {
  date?: Date;
  appointment?: any;
}

@Component({
  standalone: true,
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, ReactiveFormsModule, NgIf]
})
export class AppointmentFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef)
  data = inject(MAT_DIALOG_DATA);
  appointmentForm = new FormGroup({
    title: new FormControl<string>(this.data.appointment?.title || '', Validators.required),
    date: new FormControl<Date>(this.data.appointment?.date || this.data.date || new Date(), Validators.required),
    startTime: new FormControl<string>(this.data.appointment?.startTime || '', Validators.required),
    endTime: new FormControl<string>(this.data.appointment?.endTime || '', Validators.required),
    description: new FormControl<string>(this.data.appointment?.description || ''),
  });

  ngOnInit(): void {
    this.appointmentForm.get('startTime')?.valueChanges.subscribe((startTime) => {
      // Logic to update endTime or perform validation
    });
  }

  save(): void {
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
