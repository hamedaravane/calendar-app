import { Component, OnInit, inject } from '@angular/core';
import { NgForOf, DecimalPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {AppointmentService} from '../../services/appointment.service';
import {Appointment} from '../../entity/appointment.entity';
import {AppointmentFormComponent} from '../appointment-form/appointment-form.component';

@Component({
  standalone: true,
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  imports: [
    NgForOf,
    DecimalPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    HeaderComponent,
  ],
})
export class CalendarViewComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  appointments: Appointment[] = [];
  hours: number[] = [];
  selectedDate: Date = new Date();
  selectedView: 'Day' | 'Week' | 'Month' = 'Day';
  currentDates: Date[] = [];

  ngOnInit(): void {
    this.hours = Array.from({ length: 24 }, (_, i) => i);

    this.appointmentService.appointments$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((appointments) => {
        this.appointments = appointments;
      });

    this.updateCurrentDates();
  }

  onDateChanged(date: Date): void {
    this.selectedDate = date;
    this.updateCurrentDates();
  }

  onViewChanged(view: 'Day' | 'Week' | 'Month'): void {
    this.selectedView = view;
    this.updateCurrentDates();
  }

  updateCurrentDates(): void {
    switch (this.selectedView) {
      case 'Day':
        this.currentDates = [this.selectedDate];
        break;
      case 'Week':
        this.currentDates = this.getWeekDates(this.selectedDate);
        break;
      case 'Month':
        this.currentDates = this.getMonthDates(this.selectedDate);
        break;
    }
  }

  getWeekDates(date: Date): Date[] {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust if week starts on Monday
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  getMonthDates(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1);
    });
  }

  openAppointmentForm(date: Date): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newAppointment: Appointment = {
          id: Date.now(),
          title: result.title,
          date: result.date,
          startTime: result.startTime,
          endTime: result.endTime,
          description: result.description,
        };
        this.appointmentService.addAppointment(newAppointment);
      }
    });
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(
      (appt) => new Date(appt.date).toDateString() === date.toDateString()
    );
  }

  onDragEnded(event: CdkDragEnd, appointment: Appointment): void {
    const deltaY = event.distance.y;
    const minutesMoved = Math.round(deltaY / 50) * 30; // Adjust based on your UI
    const newStart = this.adjustTime(appointment.startTime, minutesMoved);
    const newEnd = this.adjustTime(appointment.endTime, minutesMoved);

    const updatedAppointment: Appointment = {
      ...appointment,
      startTime: newStart,
      endTime: newEnd,
    };

    this.appointmentService.updateAppointment(updatedAppointment);
  }

  adjustTime(time: string, minutesMoved: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + minutesMoved);
    const adjustedHours = date.getHours().toString().padStart(2, '0');
    const adjustedMinutes = date.getMinutes().toString().padStart(2, '0');
    return `${adjustedHours}:${adjustedMinutes}`;
  }

  deleteAppointment(appointment: Appointment): void {
    this.appointmentService.deleteAppointment(appointment.id);
  }

  setTime(date: Date, hour: number, minute: number): Date {
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  }

  getAppointmentsForHour(hour: number, halfHour: boolean, date: Date): Appointment[] {
    const time = `${hour.toString().padStart(2, '0')}:${halfHour ? '30' : '00'}`;
    return this.appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return (
        apptDate.toDateString() === date.toDateString() &&
        appt.startTime === time
      );
    });
  }
}
