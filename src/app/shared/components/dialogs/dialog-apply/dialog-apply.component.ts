import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
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

  answerNo() {
    this.dialogRef.close(false);
  }

  answerYes() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
