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
import { DialogAddMembersToNewChannelComponent } from '../dialog-add-members-to-new-channel/dialog-add-members-to-new-channel.component';
import { Channel } from '../../../../../shared/models/channel.class';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  newChannel: Channel = new Channel

  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { allChannel: Channel[], currentUserID: string },
    public dialog: MatDialog
  ) {
    this.newChannel.ownerID = this.data.currentUserID;
  }

  openDialogAddUserToNewChannel( ) {
    this.dialog.open(DialogAddMembersToNewChannelComponent, {
      panelClass: ['card-round-corners'],
      data: { newChannel: this.newChannel },
    });
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
