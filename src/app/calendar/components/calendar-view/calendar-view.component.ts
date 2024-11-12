import {Component, DestroyRef, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe, DecimalPipe, NgStyle} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CdkDragEnd, DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HeaderComponent} from '../header/header.component';
import {AppointmentService} from '../../services/appointment.service';
import {Appointment, AppointmentData} from '../../entity/appointment.entity';
import {AppointmentFormComponent} from '../appointment-form/appointment-form.component';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  standalone: true,
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
  imports: [
    DecimalPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    HeaderComponent,
    NgStyle,
  ],
})
export class CalendarViewComponent implements OnInit {
  @ViewChild('slotRef') slotRef: ElementRef | undefined = undefined;
  private readonly appointmentService = inject(AppointmentService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly today = new Date();
  appointments: Appointment[] = [];
  hours: number[] = [];
  selectedDate: Date = new Date();
  selectedView: 'Day' | 'Week' | 'Month' = 'Week';
  currentDates: Date[] = [];

  ngOnInit() {
    this.hours = Array.from({length: 24}, (_, i) => i);

    this.appointmentService.appointments$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((appointments) => {
        this.appointments = appointments;
      });

    this.updateCurrentDates();
  }

  private getSlotDimensions(): {height: number; width: number} | undefined {
    if (this.slotRef && this.slotRef.nativeElement) {
      return {height: this.slotRef.nativeElement.clientHeight, width: this.slotRef.nativeElement.clientWidth};
    } else return undefined;
  }

  getTimeString(hour: number, minute: number): string {
    const hours = hour.toString().padStart(2, '0');
    const minutesStr = minute.toString().padStart(2, '0');
    return `${hours}:${minutesStr}`;
  }

  getAppointmentsForHour(hour: number, date: Date): Appointment[] {
    const time = this.getTimeString(hour, 0);
    return this.appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return (
        apptDate.toDateString() === date.toDateString() &&
        appt.startTime === time
      );
    });
  }

  onDateChanged(date: Date) {
    this.selectedDate = date;
    this.updateCurrentDates();
  }

  onViewChanged(view: 'Day' | 'Week' | 'Month') {
    this.selectedView = view;
    this.updateCurrentDates();
  }

  updateCurrentDates() {
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
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({length: 7}, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  getMonthDates(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({length: daysInMonth}, (_, i) => {
      return new Date(year, month, i + 1);
    });
  }

  openAppointmentForm(appointmentData: AppointmentData = {}) {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: appointmentData,
    });

    dialogRef.afterClosed().subscribe((result: AppointmentData) => {
      if (result) {
        if (result.id) {
          this.appointmentService.updateAppointment(result as Appointment);
        } else {
          const newAppointment: Appointment = {
            ...result,
            id: Date.now(),
          } as Appointment;
          this.appointmentService.addAppointment(newAppointment);
        }
      }
    });
  }

  onDragEnded(event: CdkDragEnd, appointment: Appointment) {
    const deltaX = event.distance.x;
    const deltaY = event.distance.y;

    const slotHeight = this.getSlotDimensions()?.height ?? 0;
    const dayColumnWidth = this.getSlotDimensions()?.width ?? 0;

    const minutesPerSlot = 60;

    const minutesMoved = Math.round(deltaY / slotHeight) * minutesPerSlot;

    const daysMoved = Math.round(deltaX / dayColumnWidth);

    const newDate = new Date(appointment.date);
    newDate.setDate(newDate.getDate() + daysMoved);

    const newStart = this.adjustTime(newDate, appointment.startTime, minutesMoved);
    const newEnd = this.adjustTime(newDate, appointment.endTime, minutesMoved);

    const updatedAppointment: Appointment = {
      ...appointment,
      date: newDate,
      startTime: newStart,
      endTime: newEnd,
    };

    this.appointmentService.updateAppointment(updatedAppointment);
  }

  adjustTime(date: Date, time: string, minutesMoved: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes + minutesMoved);
    const adjustedHours = appointmentDateTime.getHours().toString().padStart(2, '0');
    const adjustedMinutes = appointmentDateTime.getMinutes().toString().padStart(2, '0');
    return `${adjustedHours}:${adjustedMinutes}`;
  }

  deleteAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService.deleteAppointment(appointment.id);
      }
    });
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(
      (appt) => new Date(appt.date).toDateString() === date.toDateString()
    );
  }

  get getTimeZoneOffsetString() {
    const offsetInMinutes = -new Date().getTimezoneOffset();
    const sign = offsetInMinutes >= 0 ? '+' : '-';
    const absOffsetMinutes = Math.abs(offsetInMinutes);
    const offsetHours = Math.floor(absOffsetMinutes / 60);
    const offsetMinutes = absOffsetMinutes % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `GMT${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
  }
}
