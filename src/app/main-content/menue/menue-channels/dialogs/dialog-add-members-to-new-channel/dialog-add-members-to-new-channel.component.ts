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
import { Channel } from '../../../../../shared/models/channel.class';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { ChannelService } from '../../../../../shared/firebase-services/channel.service';

@Component({
  selector: 'app-dialog-add-members-to-new-channel',
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
    MatRadioModule,
    FormsModule,
    CommonModule
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
}],
  templateUrl: './dialog-add-members-to-new-channel.component.html',
  styleUrl: './dialog-add-members-to-new-channel.component.scss'
})
export class DialogAddMembersToNewChannelComponent {

  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMembersToNewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newChannel: Channel },
    public dialog: MatDialog,
    private ChannelService: ChannelService
  ) {
  }

  async saveNewChannel() {
    this.loading = true;
    if (this.data.newChannel) {
      await this.ChannelService.addChannel(this.data.newChannel).catch(err => console.error(err));
    }
    this.loading = false;
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}


