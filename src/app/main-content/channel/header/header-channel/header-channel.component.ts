import { Component, ElementRef, ViewChild, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';
import { DialogAddUserComponent } from '../../dialogs/dialog-add-user/dialog-add-user.component';
import { User } from '../../../../shared/models/user.class';
import { Channel } from '../../../../shared/models/channel.class';
import { MembershipService } from '../../../../shared/firebase-services/membership.service';
import { PositionService } from '../../../../shared/services/position.service';
import { DialogErrorComponent } from '../../../../shared/components/dialogs/dialog-error/dialog-error.component';
import { Membership } from '../../../../shared/models/membership.class';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { ChannelDialogService } from '../../dialogs/channel-dialog.service';

@Component({
  selector: 'app-header-channel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './header-channel.component.html',
  styleUrl: './header-channel.component.scss'
})
export class HeaderChannelComponent implements OnDestroy, OnChanges {

  @Input() channel: Channel = new Channel({});
  @Input() currentChannelID!: string;

  @ViewChild('channleInfo') channelInfo?: ElementRef;
  @ViewChild('membersInfo') membersInfo?: ElementRef;
  @ViewChild('addUser') addUser?: ElementRef;

  allUsers: User[] = [];
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  currentChannelMemberIDs: string[] = [];
  displayMembers: User[] = [];
  additionalMembersCount: number = 0;

  private usersSubscription: Subscription;
  private channelMembershipSubscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    private MembershipService: MembershipService,
    private PositionService: PositionService,
    private dataService: DataService,
    private channelDialogs: ChannelDialogService
  ) {

    /**
     * Subscribes to the data service to get the list of users and assigns it to the component property.
     * @returns {void}
     */
    this.usersSubscription = this.dataService.users$.subscribe(users => {
      this.allUsers = users;
    });
  }


  /**
   * Lifecycle hook that is called when one or more data-bound input properties change.
   * Fetches channel memberships based on the current channel ID and updates relevant properties.
   * @param {SimpleChanges} changes - An object containing each changed property.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!changes) return
    if (!this.currentChannelID) return
    this.MembershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.MembershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
      this.currentChannelMemberIDs = this.currentChannelMemberships.map(membership => membership.userID);
      this.currentChannelMembers = this.allUsers.filter(user => user.id && this.currentChannelMemberIDs.includes(user.id));
      this.calculateDisplayMembers();
    });
  }


  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from channel membership and user subscriptions to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.channelMembershipSubscription?.unsubscribe();
    this.usersSubscription.unsubscribe();
  }


  /**
   * Calculates the display members based on the maximum display count.
   * Sets the display members array and calculates additional members count if any.
   * @returns {void}
   */
  calculateDisplayMembers(): void {
    const maxDisplayCount = 7;
    this.displayMembers = this.currentChannelMembers.slice(0, maxDisplayCount);
    const additionalCount = this.currentChannelMembers.length - maxDisplayCount;
    this.additionalMembersCount = additionalCount > 0 ? additionalCount : 0;
  }


  /**
   * Changes the source of two images within the channel info element based on the specified color.
   * If the channel info element is not available, the function returns early.
   * @param {string} color - The color of the icons ('black' or 'blue').
   * @returns {void}
   */
  changeImg(color: 'black' | 'blue'): void {
    if (!this.channelInfo) return;
    let srcImg1 = './../../../../../assets/img/icons/hash_';
    let srcImg2 = './../../../../../assets/img/icons/expand_more_';
    (color === 'blue') ? srcImg1 = srcImg1 + "bl_24.png" : srcImg1 = srcImg1 + "bk_22.png";
    (color === 'blue') ? srcImg2 = srcImg2 + "bl.png" : srcImg2 = srcImg2 + "bk.png";
    this.channelInfo.nativeElement.firstChild.src = srcImg1;
    this.channelInfo.nativeElement.lastChild.src = srcImg2;
  }


  /**
   * Opens a dialog to manage the channel.
   * If the channel info element is not available, the function returns early.
   * @returns {void}
   */
  openDialogChannel(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.channelInfo, 'left');
    this.channelDialogs.showChannelDialog(this.channel, this.allUsers, this.currentChannelMembers, pos)

    // const dialogRef = this.dialog.open(DialogChannelComponent, {
    //   width: '750px',
    //   position: pos, panelClass: ['card-left-corner'],
    //   data: { channel: this.channel, allUsers: this.allUsers, members: this.currentChannelMembers },
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) this.openDialogAddUser();
    // });
  }


  /**
   * Opens a dialog to display channel members.
   * If the members info element is not available, the function returns early.
   * @returns {void}
   */
  openDialogMembers(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.membersInfo, 'right');
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: { members: this.currentChannelMembers },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.openDialogAddUser();
    });
  }


  /**
   * Opens a dialog to add users to the channel.
   * If the add user element is not available, the function returns early.
   * @returns {void}
   */
  openDialogAddUser(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.addUser, 'right');
    this.currentChannelMemberIDs = this.currentChannelMembers.map(user => user.id!);
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: { allUsers: this.allUsers, currentMemberIDs: this.currentChannelMemberIDs, channel: this.channel },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log(result);
      this.saveAddedMembers(result);
    });
  }


  /**
   * Saves the selected users as members of the channel.
   * If no users are selected, the function returns early.
   * @param {User[]} selectedUsers - The users selected to be added as members.
   * @returns {void}
   */
  async saveAddedMembers(selectedUsers: User[]): Promise<void> {
    if (selectedUsers) {
      for (let user of selectedUsers) {
        try {
          let membership = this.MembershipService.createMembership(user.id!, this.channel.id);
          await this.MembershipService.addMembership(membership);
        } catch (err) {
          console.error(err);
          this.dialog.open(DialogErrorComponent, {
            panelClass: ['card-round-corners'],
            data: { errorMessage: 'Es gab ein Problem beim Hinzufügen von Mitgliedern. Bitte versuche es erneut.' }
          });
          break;
        }
      }
    }
  }


  /**
   * Event handler for when an image fails to load.
   * Updates the source of the failed image to a default image.
   * @param {Event} event - The event triggered when the image fails to load.
   * @returns {void}
   */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '../../../assets/img/avatars/unknown.jpg';
  }
}
