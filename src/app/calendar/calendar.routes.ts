import {Routes} from '@angular/router';
import {CalendarViewComponent} from './components/calendar-view/calendar-view.component';
import {AppointmentFormComponent} from './components/appointment-form/appointment-form.component';

export const routes: Routes = [
  {
    path: '', component: CalendarViewComponent
  },
  {
    path: 'add', component: AppointmentFormComponent
  }
]
