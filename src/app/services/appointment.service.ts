import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export type ValidTime = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;

export interface Appointment {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  startTime: ValidTime;
  endTime: ValidTime;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  constructor() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    this.appointmentsSubject.next(appointments);
  }

  addAppointment(appointment: Appointment): void {
    const appointments = [...this.appointmentsSubject.value, appointment];
    this.updateAppointments(appointments);
  }

  deleteAppointment(id: string): void {
    const appointments = this.appointmentsSubject.value.filter((app) => app.id !== id);
    this.updateAppointments(appointments);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const appointments = this.appointmentsSubject.value.map((app) =>
      app.id === updatedAppointment.id ? updatedAppointment : app
    );
    this.updateAppointments(appointments);
  }

  private updateAppointments(appointments: Appointment[]): void {
    this.appointmentsSubject.next(appointments);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
}
