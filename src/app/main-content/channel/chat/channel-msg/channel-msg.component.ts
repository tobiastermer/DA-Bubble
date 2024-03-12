import { Component, ElementRef, ViewChild, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Channel } from '../../../../shared/models/channel.class';
import { DataService } from '../../../../shared/services/data.service';
import { User } from '../../../../shared/models/user.class';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogsService } from '../../../../shared/services/dialogs.service';
import { ChannelDialogService } from '../../dialogs/channel-dialog.service';
import { Membership } from '../../../../shared/models/membership.class';
import { MembershipService } from '../../../../shared/firebase-services/membership.service';
import { PositionService } from '../../../../shared/services/position.service';


@Component({
  selector: 'app-channel-msg',
  standalone: true,
  imports: [],
  templateUrl: './channel-msg.component.html',
  styleUrl: './channel-msg.component.scss'
})
export class ChannelMsgComponent implements OnDestroy {

  @Input() channel: Channel = new Channel({});
  @Input() currentChannelID!: string;

  @ViewChild('channleInfo') channelInfo?: ElementRef;

  allUsers: User[] = [];

  // currentChannelID: string = '';
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  currentChannelMemberIDs: string[] = [];

  private usersSubscription: Subscription;
  private channelMembershipSubscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    public dataService: DataService,
    private dialogService: DialogsService,
    private membershipService: MembershipService,
    private channelDialog: ChannelDialogService,
    private positionService: PositionService
  ) {

    this.currentChannelID = this.channel.id;

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
    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.membershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
      this.currentChannelMemberIDs = this.currentChannelMemberships.map(membership => membership.userID);
      this.currentChannelMembers = this.allUsers.filter(user => user.id && this.currentChannelMemberIDs.includes(user.id));
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
   * Opens a dialog to manage the channel.
   * @returns {void}
   */
  openDialogChannel(): void {
    // let pos = this.positionService.getDialogPosWithCorner(this.channelInfo, 'left');
    this.channelDialog.showChannelDialog(this.channel, this.allUsers, this.currentChannelMembers);
  }


  /**
   * Opens a dialog to show the details of a user.
   * @param {string} ownerId - The ID of the user whose details are to be shown.
   * @returns {void}
   */
  openShowUserDialog(ownerId: string): void {
    let user = this.dataService.getUserById(ownerId);
    if (user) this.dialogService.showUserDialog(user, undefined);
  }


}