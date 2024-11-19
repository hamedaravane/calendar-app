import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentService, ValidTime } from '@services/appointment.service';
import { DateService } from '@services/date.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '@shared/appointment-form/appointment-form.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
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
  connectedDropLists: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dateService: DateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.connectedDropLists = [this.getDropListId(this.currentDate)];
    });
  }

  getDropListId(day: Date): string {
    return `cdk-drop-list-${day.toDateString()}`;
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    let appointmentsForDay: Appointment[] = [];
    this.appointmentService.appointments$.subscribe(appointments => {
      appointmentsForDay = appointments.filter(
        appointment => new Date(appointment.start).toDateString() === day.toDateString()
      );
    });
    return appointmentsForDay;
  }

  openAppointmentFormForHour(hour: ValidTime): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        start: this.currentDate,
        end: this.currentDate,
        startTime: hour,
        endTime: (hour + 1) as ValidTime, // Default duration is one hour
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
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: appointment,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.updateAppointment(result);
      } else if (result === false) {
        this.appointmentService.deleteAppointment(appointment.id);
      }
    });
  }

  onAppointmentDropped(event: CdkDragDrop<Appointment[]>, day: Date): void {
    const appointment = event.item.data as Appointment;

    // Calculate the new start time based on the drop position
    const dropPositionY = event.distance.y;
    const slotHeight = 60; // Height of each hour slot in pixels
    const hoursMoved = Math.round(dropPositionY / slotHeight);

    let newStartTime = (appointment.startTime + hoursMoved) as ValidTime;

    if (newStartTime < 0) {
      newStartTime = 0;
    } else if (newStartTime > 23) {
      newStartTime = 23;
    }

    const duration = appointment.endTime - appointment.startTime;
    let newEndTime = (newStartTime + duration) as ValidTime;

    if (newEndTime > 24) {
      newEndTime = 24 as ValidTime;
    }

    const newStartDate = new Date(day);
    newStartDate.setHours(newStartTime, 0, 0, 0);

    const newEndDate = new Date(day);
    newEndDate.setHours(newEndTime, 0, 0, 0);

    const updatedAppointment: Appointment = {
      ...appointment,
      start: newStartDate,
      end: newEndDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    this.appointmentService.updateAppointment(updatedAppointment);

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}
