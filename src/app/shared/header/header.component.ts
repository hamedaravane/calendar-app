import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateService } from '@services/date.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    DatePipe,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentView: 'day' | 'week' | 'month' | 'year' = 'month';
  views: ('day' | 'week' | 'month' | 'year')[] = ['year', 'month', 'week', 'day'];
  viewBasedDateFormat = 'MMMM yyyy';
  currentDate$: Observable<Date>;

  viewFormControl = new FormControl<'day' | 'week' | 'month' | 'year'>('month', Validators.required);

  constructor(
    private dateService: DateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentDate$ = this.dateService.currentDate$;
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(segments => {
      const r = segments.map(segment => segment.path).join('/');
      console.log('Current Route:', r);
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url.split('?')[0];
      console.log('router events: ', url);
      switch (true) {
        case url.startsWith('/day'):
          this.currentView = 'day';
          break;
        case url.startsWith('/week'):
          this.currentView = 'week';
          break;
        case url.startsWith('/year'):
          this.currentView = 'year';
          break;
        default:
          this.currentView = 'month';
          break;
      }
      this.viewFormControl.setValue(this.currentView);
    });
    this.viewFormControl.valueChanges.pipe(filter(Boolean)).subscribe(view => {
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
    });
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
