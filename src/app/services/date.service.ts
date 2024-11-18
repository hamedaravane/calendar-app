import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private currentDateSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  currentDate$ = this.currentDateSubject.asObservable();

  getCurrentDate(): Date {
    return this.currentDateSubject.value;
  }

  setDate(date: Date): void {
    this.currentDateSubject.next(date);
  }

  moveToNextPeriod(type: 'day' | 'week' | 'month' | 'year'): void {
    const currentDate = this.getCurrentDate();
    const newDate = new Date(currentDate);

    switch (type) {
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }

    this.setDate(newDate);
  }

  moveToPreviousPeriod(type: 'day' | 'week' | 'month' | 'year'): void {
    const currentDate = this.getCurrentDate();
    const newDate = new Date(currentDate);

    switch (type) {
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() - 1);
        break;
    }

    this.setDate(newDate);
  }

  resetToToday(): void {
    this.setDate(new Date());
  }
}
