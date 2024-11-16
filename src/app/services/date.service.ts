import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private currentDateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$ = this.currentDateSubject.asObservable();

  setCurrentDate(date: Date): void {
    this.currentDateSubject.next(date);
  }
}
