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


  /**
  * Validates the input channel name and sets the channel name error accordingly.
  * @returns {void}
  */
  validateInputChannelName(): void {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newName, this.channel?.name || '');
  }


  /**
   * Validates the input channel description and sets the channel description error accordingly.
   * @returns {void}
   */
  validateInputChannelDescription(): void {
    this.channelDescrError = this.ChannelService.validateInputChannelDescription(this.newDescription);
  }


  /**
   * Prepares for editing the channel name by setting the editName flag to true and initializing the new name.
   * @returns {void}
   */
  editChannelName(): void {
    this.editName = true;
    this.newName = this.channel?.name || '';
  }


  /**
   * Saves the edited channel name.
   * Validates the input channel name, updates the channel name, and handles errors if any.
   * @returns {Promise<void>}
   */
  async saveChannelName(): Promise<void> {
    this.channelNameError = this.ChannelService.validateInputChannelName(this.newName, this.channel?.name || '');
    if (!(this.channelNameError === '' && this.newName.trim() !== '')) return
    this.loading = true;
    try {
      await this.updateChannelName();
    } catch (err) {
      console.error(err);
      this.openErrorDialog('Es gab ein Problem beim Aktualisieren der Kanalbeschreibung. Bitte versuche es erneut.');
    } finally {
      this.loadingDone('Name')
    }
  }


  /**
   * Updates the name of the channel asynchronously.
   * If the channel or its ID is not available, the function returns early.
   * @returns {Promise<void>}
   */
  async updateChannelName(): Promise<void> {
    if (!this.channel) return
    if (!this.channel.id) return
    this.channel.name = this.newName;
    await this.ChannelService.updateChannel(this.channel);
  }


  /**
   * Prepares for editing the channel description by setting the editDesc flag to true and initializing the new description.
   * @returns {void}
   */
  editChannelDescr(): void {
    this.editDesc = true;
    this.newDescription = this.channel?.description || '';
  }


  /**
   * Saves the edited channel description.
   * Validates the input channel description, updates the channel description, and handles errors if any.
   * @returns {Promise<void>}
   */
  async saveChannelDescr(): Promise<void> {
    this.channelDescrError = this.ChannelService.validateInputChannelDescription(this.newDescription);
    if (!(this.channelDescrError === '' && this.newDescription.trim() !== '')) return
    this.loading = true;
    try {
      this.updateChannelDescr();
    } catch (err) {
      console.error(err);
      this.openErrorDialog('Es gab ein Problem beim Aktualisieren der Kanalbeschreibung. Bitte versuche es erneut.');
    } finally {
      this.loadingDone('Desc');
    }
  }


  /**
   * Updates the description of the channel asynchronously.
   * If the channel or its ID is not available, the function returns early.
   * @returns {Promise<void>}
   */
  async updateChannelDescr(): Promise<void> {
    if (!this.channel) return
    if (!this.channel.id) return
    this.channel.description = this.newDescription;
    await this.ChannelService.updateChannel(this.channel);
  }


  /**
   * Opens a dialog window to display an error message.
   * @param {string} errorInfo - The error message to display in the dialog.
   * @returns {void}
   */
  openErrorDialog(errorInfo: string): void {
    this.dialog.open(DialogErrorComponent, {
      panelClass: ['card-round-corners'],
      data: { errorMessage: errorInfo }
    });
  }


  /**
   * Marks the completion of loading for either the description or the name of the channel.
   * @param {'Desc' | 'Name'} part - Specifies whether the description or the name was being loaded.
   * @returns {void}
   */
  loadingDone(part: 'Desc' | 'Name'): void {
    this.loading = false;
    (part === 'Desc') ? this.editDesc = false : this.editName = false;
  }


  /**
   * Closes this dialog without any action.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Retrieves the name of the user associated with the channel owner ID.
   * @returns {string | null} The name of the user associated with the channel owner ID, or 'Unbekannter Nutzer' if not found.
   */
  getUserNameFromChannelOwnerID(): string | null {
    const owner = this.data.allUsers.find(user => user.id === this.data.channel.ownerID);
    return owner ? owner.name : 'Unbekannter Nutzer';
  }


  /**
   * Opens a dialog to confirm leaving the channel.
   * @returns {void}
   */
  openLeaveChannelDialog(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.applyInp, 'right');
    const dialogRef = this.dialog.open(DialogApplyComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: this.getLeavingDatas(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.deleteMembership();
    });
  }


  /**
   * Retrieves leaving confirmation dialog data.
   * @returns {Object} The leaving confirmation dialog data.
   */
  getLeavingDatas(): {} {
    return {
      labelHeader: 'Sind Sie sicher?',
      labelDescription: 'Sie verlieren damit den Zugang zum Channel und dessen Nachrichten. Um wieder beitreten zu können, müssen Sie durch einen anderen Nutzer hinzugefügt werden. Wollen Sie wirklich fortfahren?',
      labelBtnNo: 'Abbrechen',
      labelBtnYes: 'Channel verlassen'
    }
  }


  /**
   * Deletes the user's membership from the channel.
   * If the user's ID and the channel ID are available, the user's membership is deleted from the service.
   * @returns {Promise<void>}
   */
  async deleteMembership(): Promise<void> {
    this.loading = true;
    const currentUserID = this.DataService.currentUser.id;
    if (currentUserID && this.channel!.id) await this.deletFromMembershipService(currentUserID)
    this.loading = false;
    this.dialogRef.close();
    this.router.navigate([currentUserID + '/new/message/']);
  }


  /**
   * Deletes the user's membership from the membership service.
   * @param {string} currentUserID - The ID of the current user.
   * @returns {Promise<void>}
   */
  async deletFromMembershipService(currentUserID: string): Promise<void> {
    try {
      const memberships = await this.MembershipService.getMembershipID(currentUserID, this.channel!.id);
      for (const membership of memberships) await this.MembershipService.deleteMembership(membership).catch(err => console.error(err));
    } catch (error) {
      console.error("Fehler beim Löschen der Mitgliedschaft: ", error);
    }
  }

}