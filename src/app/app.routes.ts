import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/month', pathMatch: 'full' },
  {
    path: 'day',
    loadComponent: () => import('./views/day/day-view/day-view.component').then(c => c.DayViewComponent),
  },
  {
    path: 'week',
    loadComponent: () => import('./views/week/week-view/week-view.component').then(c => c.WeekViewComponent),
  },
  {
    path: 'month',
    loadComponent: () => import('./views/month/month-view/month-view.component').then(c => c.MonthViewComponent),
  },
  {
    path: 'year',
    loadComponent: () => import('./views/year/year-view/year-view.component').then(c => c.YearViewComponent),
  },
  { path: '**', redirectTo: '/month' },
];
