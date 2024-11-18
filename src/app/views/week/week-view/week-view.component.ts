import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentService, ValidTime } from '@services/appointment.service';
import { DateService } from '@services/date.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '@shared/appointment-form/appointment-form.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [DragDropModule, NgForOf, DatePipe, NgStyle],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss',
})
export class WeekViewComponent implements OnInit {
  currentDate: Date = new Date();
  weekDays: Date[] = [];
  hours: ValidTime[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  appointmentsByDay: Record<string, Appointment[]> = {};
  connectedDropLists: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dateService: DateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.generateWeekDays();
      this.loadAppointments();
    });
  }

  generateWeekDays(): void {
    this.weekDays = [];
    this.connectedDropLists = [];

    const startOfWeek = new Date(this.currentDate);
    const dayOfWeek = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = startOfWeek.getDate() - dayOfWeek;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.weekDays.push(day);

      // Add drop list IDs for each day
      const dropListId = this.getDropListId(day);
      this.connectedDropLists.push(dropListId);
    }
  }

  getDropListId(day: Date): string {
    return `cdk-drop-list-${day.toDateString()}`;
  }

  loadAppointments(): void {
    this.appointmentService.appointments$.subscribe(appointments => {
      this.appointmentsByDay = {};

      appointments.forEach(appointment => {
        const start = new Date(appointment.start);
        const dateKey = start.toDateString();

        if (!this.appointmentsByDay[dateKey]) {
          this.appointmentsByDay[dateKey] = [];
        }
        this.appointmentsByDay[dateKey].push(appointment);
      });
    });
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    const dateKey = day.toDateString();
    return this.appointmentsByDay[dateKey] || [];
  }

  openAppointmentFormForSlot(day: Date, hour: ValidTime): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        start: day,
        end: day,
        startTime: hour,
        endTime: (hour + 1) as ValidTime, // Default to one-hour duration
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

    // Update UI (optional, depending on how appointments are displayed)
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
    );
  }
}
