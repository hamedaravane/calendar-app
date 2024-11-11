import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Appointment} from '../entity/appointment.entity';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  constructor() {}

  getAppointments(): Appointment[] {
    return this.appointmentsSubject.getValue();
  }

  addAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments();
    this.appointmentsSubject.next([...appointments, appointment]);
  }

  deleteAppointment(id: number): void {
    const appointments = this.getAppointments().filter((appt) => appt.id !== id);
    this.appointmentsSubject.next(appointments);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const appointments = this.getAppointments().map((appt) =>
      appt.id === updatedAppointment.id ? updatedAppointment : appt
    );
    this.appointmentsSubject.next(appointments);
  }
}
