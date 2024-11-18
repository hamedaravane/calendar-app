import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentService } from '@services/appointment.service';
import { DateService } from '@services/date.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '@shared/appointment-form/appointment-form.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-year-view',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './year-view.component.html',
  styleUrl: './year-view.component.scss',
})
export class YearViewComponent implements OnInit {
  currentYear = 2024;
  months: { name: string; dates: Date[] }[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private dateService: DateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe(date => {
      this.currentYear = date.getFullYear();
      this.generateYear();
    });
  }

  generateYear(): void {
    this.months = [];
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(this.currentYear, month, 1);
      const dates: Date[] = [];
      const currentDay = new Date(firstDayOfMonth);

      while (currentDay.getMonth() === month) {
        dates.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }

      this.months.push({
        name: firstDayOfMonth.toLocaleString('default', { month: 'long' }),
        dates,
      });
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  openAppointmentFormForDay(date: Date): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {
        start: date,
        end: date,
        startTime: null,
        endTime: null,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.addAppointment(result);
      }
    });
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    let appointmentsForDay: Appointment[] = [];
    this.appointmentService.appointments$.subscribe(appointments => {
      appointmentsForDay = appointments.filter(
        appointment => new Date(appointment.start).toDateString() === date.toDateString()
      );
    });
    return appointmentsForDay;
  }
}
