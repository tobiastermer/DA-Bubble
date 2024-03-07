import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-error',
  standalone: true,
  imports: [MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    CommonModule],
  templateUrl: './dialog-error.component.html',
  styleUrl: './dialog-error.component.scss'
})
export class DialogErrorComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      errorMessage: string,
    },
    public dialog: MatDialog,
  ) { }


  /**
   * Closes the dialog without performing any action.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
