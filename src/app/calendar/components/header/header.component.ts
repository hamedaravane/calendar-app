import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, DatePipe, NgForOf]
})
export class HeaderComponent {
  @Output() dateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<'Day' | 'Week' | 'Month'>();

  selectedDate = new Date();
  selectedView: 'Day' | 'Week' | 'Month' = 'Week';

  goToToday(): void {
    this.selectedDate = new Date();
    this.dateChanged.emit(this.selectedDate);
  }

  previousDate(): void {
    const temp = this.selectedDate;
    switch (this.selectedView) {
      case 'Day':
        temp.setDate(this.selectedDate.getDate() - 1);
        break;
      case 'Week':
        temp.setDate(temp.getDate() - 7);
        break;
      case 'Month':
        temp.setMonth(temp.getMonth() - 1);
        break;
    }
    this.selectedDate = new Date(temp);
    this.dateChanged.emit(new Date(this.selectedDate));
  }

  nextDate(): void {
    const temp = this.selectedDate;
    switch (this.selectedView) {
      case 'Day':
        temp.setDate(this.selectedDate.getDate() + 1);
        break;
      case 'Week':
        temp.setDate(temp.getDate() + 7);
        break;
      case 'Month':
        temp.setMonth(temp.getMonth() + 1);
        break;
    }
    this.selectedDate = new Date(temp);
    this.dateChanged.emit(new Date(this.selectedDate));
  }

  onViewChange(view: 'Day' | 'Week' | 'Month' = 'Day') {
    this.selectedView = view;
    this.viewChanged.emit(this.selectedView);
  }
}
