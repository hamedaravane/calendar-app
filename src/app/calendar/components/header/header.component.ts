// header.component.ts
import {Component, EventEmitter, Output} from '@angular/core';
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
  styleUrls: ['./header.component.scss'],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, DatePipe, NgForOf]
})
export class HeaderComponent {
  @Output() dateChanged = new EventEmitter<Date>();
  @Output() viewChanged = new EventEmitter<string>();

  selectedDate: Date = new Date();
  viewTypes: string[] = ['Day', 'Week', 'Month'];
  selectedView: string = 'Day';

  constructor() {}

  goToToday(): void {
    this.selectedDate = new Date();
    this.dateChanged.emit(this.selectedDate);
  }

  previousDate(): void {
    switch (this.selectedView) {
      case 'Day':
        this.selectedDate.setDate(this.selectedDate.getDate() - 1);
        break;
      case 'Week':
        this.selectedDate.setDate(this.selectedDate.getDate() - 7);
        break;
      case 'Month':
        this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
        break;
    }
    this.dateChanged.emit(new Date(this.selectedDate));
  }

  nextDate(): void {
    switch (this.selectedView) {
      case 'Day':
        this.selectedDate.setDate(this.selectedDate.getDate() + 1);
        break;
      case 'Week':
        this.selectedDate.setDate(this.selectedDate.getDate() + 7);
        break;
      case 'Month':
        this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
        break;
    }
    this.dateChanged.emit(new Date(this.selectedDate));
  }

  onViewChange(view: string): void {
    this.selectedView = view;
    this.viewChanged.emit(this.selectedView);
  }
}
