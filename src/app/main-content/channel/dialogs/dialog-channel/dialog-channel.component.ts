import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../shared/models/user.class';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { CommonModule } from '@angular/common';
import { Channel } from '../../../../shared/models/channel.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChannelService } from '../../../../shared/firebase-services/channel.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-dialog-channel',
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
    MatProgressBarModule,
    UserChipComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './dialog-channel.component.html',
  styleUrl: './dialog-channel.component.scss'
})
export class DialogChannelComponent {

  loading: boolean = false;
  editName = false;
  editDesc = false;
  channel?: Channel;
  newName: string = '';
  newDescription: string = '';
  channelNameError: string = '';
  channelDescrError: string = '';

  @ViewChild('userInp') userInp?: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DialogChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { channel: Channel, allUsers: User[] },
    private ChannelService: ChannelService,
  ) {
    if (!data) this.onNoClick();
    this.channel = data.channel;
  }

  editChannelName(){
    this.editName = true;
    this.newName = this.channel?.name || '';
  }

  async saveChannelName() {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newName);
    if (this.channelNameError === '' && this.newName.trim() !== '') {
      this.loading = true;
      if (this.channel && this.channel.id) {
        this.channel.name = this.newName;
        await this.ChannelService.updateChannel(this.channel).catch(err => console.error(err));
      }
      this.loading = false;
      this.editName = false;
    }
  }

  editChannelDescr() {
    this.editDesc = true;
    this.newDescription = this.channel?.description || '';
  }

  async saveChannelDescr() {
    this.channelDescrError = this.ChannelService.validateInputChannelDescription(this.newDescription);
    if (this.channelDescrError === '' && this.newDescription.trim() !== '') {
      this.loading = true;
      if (this.channel && this.channel.id) {
        this.channel.description = this.newDescription;
        await this.ChannelService.updateChannel(this.channel).catch(err => console.error(err));
      }
      this.loading = false;
      this.editDesc = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUserNameFromChannelOwnerID(): string | null {
    const owner = this.data.allUsers.find(user => user.id === this.data.channel.ownerID);
    return owner ? owner.name : 'Unbekannter Nutzer';
  }

}
