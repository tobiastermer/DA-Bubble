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
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dialog-apply',
  standalone: true,
  imports: [MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatProgressBarModule,
    MatRadioModule,
    FormsModule,
    CommonModule,],
  templateUrl: './dialog-apply.component.html',
  styleUrl: './dialog-apply.component.scss'
})
export class DialogApplyComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogApplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      labelHeader: string,
      labelDescription: string,
      labelBtnNo: string,
      labelBtnYes: string
    },
    public dialog: MatDialog,
  ) { }


  /**
   * Closes the dialog with a response indicating 'false'.
   * Typically used to reject an action when the user selects 'No'.
   * @returns {void}
   */
  answerNo(): void {
    this.dialogRef.close(false);
  }


  /**
   * Closes the dialog with a response indicating 'true'.
   * Typically used to confirm an action when the user selects 'Yes'.
   * @returns {void}
   */
  answerYes(): void {
    this.dialogRef.close(true);
  }


  /**
   * Closes the dialog without sending any response.
   * Typically used when the user closes the dialog without making a selection.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
