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

  public addEmoji(event:any) {
    this.dialogRef.close(`${event.emoji.native}`);
  }
}
