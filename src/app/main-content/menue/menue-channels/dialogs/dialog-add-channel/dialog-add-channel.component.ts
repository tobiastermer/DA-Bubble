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
import { ChannelService } from '../../../../../shared/firebase-services/channel.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../../../../shared/models/user.class';
import { MembershipService } from '../../../../../shared/firebase-services/membership.service';
import { Router } from '@angular/router';
import { Membership } from '../../../../../shared/models/membership.class';

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
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss'
})
export class DialogAddChannelComponent {

  loading: boolean = false;
  newChannel: Channel = new Channel
  newChannelMemberIDs: string[] = [];
  channelNameError: string = '';
  descriptionError: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { allChannel: Channel[], currentUserID: string, allUsers: User[], pathUserName: string },
    public dialog: MatDialog,
    private ChannelService: ChannelService,
    private MembershipService: MembershipService,
    private router: Router
  ) {
    this.newChannel.ownerID = this.data.currentUserID;
    this.newChannelMemberIDs.push(this.newChannel.ownerID);
  }

  validateInputName() {
    if (this.newChannel.name.length > 0) {
      if (this.newChannel.name.length < 5) {
        this.channelNameError = 'Der Channel-Name muss mindestens 5 Zeichen lang sein.';
      } else if (this.newChannel.name.includes(' ')) {
        this.channelNameError = 'Der Channel-Name darf keine Leerzeichen enthalten.';
      } else if (!this.channelNameIsUnique()) {
        this.channelNameError = 'Ein Channel mit diesem Namen existiert bereits.';
      } else {
        this.channelNameError = '';
      }
    } else {
      this.channelNameError = '';
    }
  }

  validateInputDescription() {
    if (this.newChannel.description.length > 0) {
      if (this.newChannel.description.length < 5) {
        this.descriptionError = 'Die Beschreibung muss mindestens 5 Zeichen lang sein.';
      } else {
        this.descriptionError = '';
      }
    } else {
      this.descriptionError = '';
    }
  }

  channelNameIsUnique(): boolean {
    const newNameLowerCase = this.newChannel.name.toLowerCase();
    return !this.data.allChannel.some(channel => channel.name.toLowerCase() === newNameLowerCase);
  }

  canSaveNewChannel(): boolean {
    this.validateInputName();
    this.validateInputDescription();
    return !this.channelNameError && !this.descriptionError && this.newChannel.name.length > 0 && this.newChannel.description.length > 0;
  }

  async saveNewChannel() {
    this.loading = true;
    if (this.newChannel.name && this.newChannel.description) {
      try {
        const channelId = await this.ChannelService.addChannel(this.newChannel) as string;
        this.newChannel.id = channelId; // Setze die ID für das Channel-Objekt
        this.saveOwnerMembership();
        this.router.navigate([this.data.pathUserName + '/channel/' + this.newChannel.name]);
        this.openDialogAddUserToNewChannel(); // Weiterarbeiten mit dem vervollständigten Channel-Objekt
      } catch (err) {
        console.error(err);
      }
    }
    this.loading = false;
    this.dialogRef.close();
  }

  async saveOwnerMembership() {
    const membership = this.MembershipService.createMembership(this.newChannel.ownerID, this.newChannel.id);
    try {
      await this.MembershipService.addMembership(membership);
    } catch (err) {
      console.error(err);
    }
  }

  openDialogAddUserToNewChannel() {
    this.dialog.open(DialogAddMembersToNewChannelComponent, {
      panelClass: ['card-round-corners'],
      data: { newChannel: this.newChannel, allUsers: this.data.allUsers, currentMemberIDs: this.newChannelMemberIDs },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
