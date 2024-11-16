import {Component, OnInit} from '@angular/core';
import {Appointment, AppointmentService} from '@services/appointment.service';
import {MatDialog} from '@angular/material/dialog';
import {AppointmentFormComponent} from '@shared/appointment-form/appointment-form.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, DatePipe, NgForOf} from '@angular/common';
import {CdkDragDrop, DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {DateService} from '@services/date.service';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    DatePipe,
    NgForOf,
    DragDropModule,
    AsyncPipe,
  ],
  templateUrl: './month-view.component.html',
  styleUrl: './month-view.component.scss'
})
export class MonthViewComponent implements OnInit {
  weeks: Date[][] = [];
  currentDate!: Date;
  appointmentsByDate: Record<string, Appointment[]> = {};
  connectedDropLists: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe((date) => {
      this.currentDate = date;
      this.generateCalendar();
      this.loadAppointments();
    });
  }

  generateCalendar(): void {
    this.weeks = [];
    this.connectedDropLists = [];
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let week = 0; week < 6; week++) {
      const days: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + week * 7 + day);
        days.push(date);

        // Add the drop list ID to the connected drop lists
        const dropListId = this.getDropListId(date);
        if (!this.connectedDropLists.includes(dropListId)) {
          this.connectedDropLists.push(dropListId);
        }
      }
      this.weeks.push(days);
    }
  }

  getDropListId(date: Date): string {
    return 'cdk-drop-list-' + date.toDateString();
  }

  loadAppointments(): void {
    this.appointmentService.appointments$.subscribe((appointments) => {
      this.appointmentsByDate = {};
      appointments.forEach((appointment) => {
        const dateKey = new Date(appointment.start).toDateString();
        if (!this.appointmentsByDate[dateKey]) {
          this.appointmentsByDate[dateKey] = [];
        }
        this.appointmentsByDate[dateKey].push(appointment);
      });
    });
  }

  getAppointmentsForDay(day: Date): Appointment[] {
    const dateKey = day.toDateString();
    return this.appointmentsByDate[dateKey] || [];
  }

  openAppointmentFormForDay(day: Date): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        start: day,
        end: day,
        startTime: null,
        endTime: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService.updateAppointment(result);
      } else if (result === false) {
        this.appointmentService.deleteAppointment(appointment.id);
      }
    });
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return this.isSameDate(today, day);
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  onAppointmentDropped(event: CdkDragDrop<Appointment[]>, day: Date): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const appointment = event.item.data as Appointment;
    const newStartDate = new Date(day);
    newStartDate.setHours(appointment.startTime, 0, 0, 0);

    const newEndDate = new Date(newStartDate);
    const durationHours = appointment.endTime - appointment.startTime;
    newEndDate.setHours(newEndDate.getHours() + durationHours);

    const updatedAppointment: Appointment = {
      ...appointment,
      start: newStartDate,
      end: newEndDate,
    };

    this.appointmentService.updateAppointment(updatedAppointment);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  trackByDate(index: number, item: Date): string {
    return item.toDateString();
  }
}
