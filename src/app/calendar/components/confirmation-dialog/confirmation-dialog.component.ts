import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>Are you sure you want to delete this appointment?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button color="warn" (click)="onYesClick()">Delete</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef);

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.dialogRef.close(true);
  }
}
