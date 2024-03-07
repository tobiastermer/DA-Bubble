import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-dialog-emoji',
  standalone: true,
  imports: [
    PickerComponent,
    EmojiComponent
  ],
  templateUrl: './dialog-emoji.component.html',
  styleUrl: './dialog-emoji.component.scss'
})
export class DialogEmojiComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogEmojiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialog: MatDialog
  ) { }


  /**
   * Adds the selected emoji to the dialog and closes it.
   * @param {any} event - The event containing the selected emoji.
   * @returns {void}
   */
  public addEmoji(event: any): void {
    this.dialogRef.close(`${event.emoji.native}`);
  }
}
