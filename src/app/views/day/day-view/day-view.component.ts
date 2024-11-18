import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentService, ValidTime } from '@services/appointment.service';
import { DateService } from '@services/date.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '@shared/appointment-form/appointment-form.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [DragDropModule, DatePipe, NgForOf, NgStyle],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
})
export class DayViewComponent implements OnInit {
  currentDate: Date = new Date();
  hours: ValidTime[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  appointmentsByHour: Record<string, Appointment[]> = {};

  constructor(
    private appointmentService: AppointmentService,
    private dateService: DateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.loadAppointments();
    });
  }

  loadAppointments(): void {
    this.appointmentService.appointments$.subscribe(appointments => {
      this.appointmentsByHour = {};

      appointments.forEach(appointment => {
        const start = new Date(appointment.start);
        const dayKey = start.toDateString();

        if (dayKey === this.currentDate.toDateString()) {
          if (!this.appointmentsByHour[appointment.startTime]) {
            this.appointmentsByHour[appointment.startTime] = [];
          }
          this.appointmentsByHour[appointment.startTime].push(appointment);
        }
      });
    });
  }

  getAppointmentsForHour(hour: ValidTime): Appointment[] {
    return this.appointmentsByHour[hour] || [];
  }

  openAppointmentFormForHour(hour: ValidTime): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        start: this.currentDate,
        end: this.currentDate,
        startTime: hour,
        endTime: (hour + 1) as ValidTime,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.addAppointment(result);
      }
    });
  }

  openAppointmentForm(appointment: Appointment, event: Event): void {
    event.stopPropagation();
    this.appointmentService.openAppointmentForm(appointment, this.dialog);
  }

  onAppointmentDropped(event: CdkDragDrop<Appointment[]>, hour: ValidTime): void {
    const appointment = event.item.data as Appointment;

    const newStartDate = new Date(this.currentDate);
    newStartDate.setHours(hour, 0, 0, 0);

    const duration = appointment.endTime - appointment.startTime;
    const newEndDate = new Date(newStartDate);
    newEndDate.setHours(newStartDate.getHours() + duration);

    const updatedAppointment: Appointment = {
      ...appointment,
      start: newStartDate,
      end: newEndDate,
      startTime: hour,
      endTime: (hour + duration) as ValidTime,
    };

    this.appointmentService.updateAppointment(updatedAppointment);
  }
}
