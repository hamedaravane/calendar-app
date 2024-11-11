// calendar-view.component.ts
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragEnd, DragDropModule} from '@angular/cdk/drag-drop';
import {Appointment} from '../../entity/appointment.entity';
import {AppointmentService} from '../../services/appointment.service';
import {AppointmentFormComponent} from '../appointment-form/appointment-form.component';
import {DecimalPipe, NgForOf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from '../header/header.component';

@Component({
  standalone: true,
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  imports: [
    NgForOf,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    HeaderComponent
  ]
})
export class CalendarViewComponent implements OnInit {
  appointments: Appointment[] = [];
  hours: number[] = [];
  selectedDate: Date = new Date();
  selectedView: string = 'Day';

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.hours = Array.from({ length: 24 }, (_, i) => i); // Generate hours 0 to 23

    this.appointmentService.appointments$.subscribe((appointments) => {
      this.appointments = appointments;
    });
  }

  onDateChanged(date: Date): void {
    this.selectedDate = date;
    // Update the calendar display based on the new date
  }

  onViewChanged(view: string): void {
    this.selectedView = view;
    // Update the calendar display based on the new view
  }

  openAppointmentForm(date: number): void {
    const formattedData = new Date(date);
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { formattedData },
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

  getAppointmentsForHour(hour: number, halfHour: boolean): Appointment[] {
    const time = `${hour}:${halfHour ? '30' : '00'}`;
    return this.appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return (
        apptDate.toDateString() === this.selectedDate.toDateString() &&
        appt.startTime === time
      );
    });
  }

  onDragEnded(event: CdkDragEnd, appointment: Appointment): void {
    const deltaY = event.distance.y;
    const minutesMoved = Math.round(deltaY / 50) * 30; // Assuming 50px per 30 minutes
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
}
