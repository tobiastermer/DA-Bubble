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
import { DialogErrorComponent } from '../../../../../shared/components/dialogs/dialog-error/dialog-error.component';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../../../shared/services/data.service';

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
    @Inject(MAT_DIALOG_DATA) public data: { allChannel: Channel[], pathUserName: string },
    public dialog: MatDialog,
    private ChannelService: ChannelService,
    private MembershipService: MembershipService,
    private DataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.newChannel.ownerID = this.DataService.currentUser.id!;
    this.newChannelMemberIDs.push(this.newChannel.ownerID);
  }

  validateInputChannelName() {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newChannel.name, '');
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }

  validateInputChannelDescription() {
    this.descriptionError = this.ChannelService.validateInputChannelDescription(this.newChannel.description);
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }

  canSaveNewChannel(): boolean {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newChannel.name, '');
    this.descriptionError = this.ChannelService.validateInputChannelDescription(this.newChannel.description);
    return !this.channelNameError && !this.descriptionError && this.newChannel.name.length > 0 && this.newChannel.description.length > 0;
  }

  async saveNewChannel() {
    this.loading = true;
    if (this.newChannel.name && this.newChannel.description) {
      try {
        const channelId = await this.ChannelService.addChannel(this.newChannel) as string;
        this.newChannel.id = channelId;
        this.saveOwnerMembership();
        this.router.navigate([this.data.pathUserName + '/channel/' + this.newChannel.name]);
        this.openDialogAddUserToNewChannel();
      } catch (err) {
        this.loading = false;
        console.error(err);
        this.dialog.open(DialogErrorComponent, {
          panelClass: ['card-round-corners'],
          data: { errorMessage: 'Es gab ein Problem beim Erstellen des Channels. Bitte versuche es erneut.' }
        });
        return;
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
      data: { newChannel: this.newChannel, currentMemberIDs: this.newChannelMemberIDs },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
