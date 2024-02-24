import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
  DialogPosition,
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
import { DialogApplyComponent } from '../../../../shared/components/dialogs/dialog-apply/dialog-apply.component';
import { MembershipService } from '../../../../shared/firebase-services/membership.service';
import { DataService } from '../../../../shared/services/data.service';
import { Router } from '@angular/router';
import { PositionService } from '../../../../shared/services/position.service';
import { DialogErrorComponent } from '../../../../shared/components/dialogs/dialog-error/dialog-error.component';

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
  @ViewChild('applyInp') applyInp?: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DialogChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { channel: Channel, allUsers: User[] },
    private ChannelService: ChannelService,
    private MembershipService: MembershipService,
    private DataService: DataService,
    private PositionService: PositionService,
    public dialog: MatDialog,
    private router: Router
  ) {
    if (!data) this.onNoClick();
    this.channel = data.channel;
  }

  
  validateInputChannelName() {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newName, this.channel?.name || '');
  }

  validateInputChannelDescription() {
    this.channelDescrError = this.ChannelService.validateInputChannelDescription(this.newDescription);
  }

  editChannelName() {
    this.editName = true;
    this.newName = this.channel?.name || '';
  }

  async saveChannelName() {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newName, this.channel?.name || '');
    if (this.channelNameError === '' && this.newName.trim() !== '') {
      this.loading = true;
      try {
        if (this.channel && this.channel.id) {
          this.channel.name = this.newName;
          await this.ChannelService.updateChannel(this.channel);
        }
      } catch (err) {
        console.error(err);
        this.dialog.open(DialogErrorComponent, {
          panelClass: ['card-round-corners'],
          data: { errorMessage: 'Es gab ein Problem beim Aktualisieren des Kanalnamens. Bitte versuche es erneut.' }
        });
      } finally {
        this.loading = false;
        this.editName = false;
      }
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
      try {
        if (this.channel && this.channel.id) {
          this.channel.description = this.newDescription;
          await this.ChannelService.updateChannel(this.channel);
        }
      } catch (err) {
        console.error(err);
        this.dialog.open(DialogErrorComponent, {
          panelClass: ['card-round-corners'],
          data: { errorMessage: 'Es gab ein Problem beim Aktualisieren der Kanalbeschreibung. Bitte versuche es erneut.' }
        });
      } finally {
        this.loading = false;
        this.editDesc = false;
      }
    }
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  getUserNameFromChannelOwnerID(): string | null {
    const owner = this.data.allUsers.find(user => user.id === this.data.channel.ownerID);
    return owner ? owner.name : 'Unbekannter Nutzer';
  }

  openLeaveChannelDialog() {
    let pos = this.PositionService.getDialogPosWithCorner(this.applyInp, 'right');
    const dialogRef = this.dialog.open(DialogApplyComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: {
        labelHeader: 'Sind Sie sicher?',
        labelDescription: 'Sie verlieren damit den Zugang zum Channel und dessen Nachrichten. Um wieder beitreten zu können, müssen Sie durch einen anderen Nutzer hinzugefügt werden. Wollen Sie wirklich fortfahren?',
        labelBtnNo: 'Abbrechen',
        labelBtnYes: 'Channel verlassen'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMembership();
      }
    });
  }

  async deleteMembership() {
    this.loading = true;
    const currentUserID = this.DataService.currentUserID;
    if (currentUserID && this.channel!.id) {
      try {
        const memberships = await this.MembershipService.getMembershipID(currentUserID, this.channel!.id);
        for (const membership of memberships) {
          await this.MembershipService.deleteMembership(membership).catch(err => console.error(err));
        }
      } catch (error) {
        console.error("Fehler beim Löschen der Mitgliedschaft: ", error);
      }
    }
    this.loading = false;
    this.dialogRef.close();
    this.router.navigate([currentUserID + '/new/message/']);
  }

}