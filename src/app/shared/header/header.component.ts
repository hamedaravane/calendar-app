import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateService } from '@services/date.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DatePipe, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentView: 'day' | 'week' | 'month' | 'year' = 'month';
  viewBasedDateFormat = 'MMMM yyyy';
  currentDate$: Observable<Date>;

  constructor(
    private dateService: DateService,
    private router: Router
  ) {
    this.currentDate$ = this.dateService.currentDate$;
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('?')[0];
      if (url.startsWith('/day')) {
        this.currentView = 'day';
      } else if (url.startsWith('/week')) {
        this.currentView = 'week';
      } else if (url.startsWith('/month')) {
        this.currentView = 'month';
      } else if (url.startsWith('/year')) {
        this.currentView = 'year';
      }
    });
  }

  changeView(view: 'day' | 'week' | 'month' | 'year') {
    this.router.navigate(['/', view]);
    this.currentView = view;
    switch (view) {
      case 'day':
        this.viewBasedDateFormat = 'EEEE, MMMM dd';
        break;
      case 'week':
        this.viewBasedDateFormat = 'MMMM dd';
        break;
      case 'year':
        this.viewBasedDateFormat = 'yyyy';
        break;
      default:
        this.viewBasedDateFormat = 'MMMM yyyy';
        break;
    }
  }

  goToToday(): void {
    this.dateService.setDate(new Date());
  }

  previousPeriod(): void {
    this.dateService.moveToPreviousPeriod(this.currentView);
  }

  nextPeriod(): void {
    this.dateService.moveToNextPeriod(this.currentView);
  }
}
