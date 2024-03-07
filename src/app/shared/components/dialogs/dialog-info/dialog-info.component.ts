import { Component, Inject } from '@angular/core';
import { DialogEmojiComponent } from '../dialog-emoji/dialog-emoji.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-info',
  standalone: true,
  imports: [],
  templateUrl: './dialog-info.component.html',
  styleUrl: './dialog-info.component.scss'
})
export class DialogInfoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogEmojiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: string },
  ) { }


  /**
   * Closes the dialog without performing any action.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
