export interface Appointment {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
}