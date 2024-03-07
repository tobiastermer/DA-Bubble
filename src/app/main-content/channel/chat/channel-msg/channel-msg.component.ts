import { Component, Input, OnDestroy } from '@angular/core';
import { Channel } from '../../../../shared/models/channel.class';
import { DataService } from '../../../../shared/services/data.service';
import { User } from '../../../../shared/models/user.class';
import { Subscription } from 'rxjs';
import { DialogChannelComponent } from '../../dialogs/dialog-channel/dialog-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogShowUserComponent } from '../../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';

@Component({
  selector: 'app-channel-msg',
  standalone: true,
  imports: [],
  templateUrl: './channel-msg.component.html',
  styleUrl: './channel-msg.component.scss'
})
export class ChannelMsgComponent implements OnDestroy {

  @Input() channel: Channel = new Channel({});

  allUsers: User[] = [];

  currentChannelID: string = '';

  private usersSubscription: Subscription;


  constructor(
    public dialog: MatDialog,
    public dataService: DataService
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
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from the user subscription to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }


  /**
   * Opens a dialog to manage the channel.
   * @returns {void}
   */
  openDialogChannel(): void {
    this.dialog.open(DialogChannelComponent, {
      width: '750px',
      panelClass: ['card-round-corners'],
      data: { channel: this.channel, allUsers: this.allUsers },
    });
  }


  /**
   * Opens a dialog to show the details of a user.
   * @param {string} ownerId - The ID of the user whose details are to be shown.
   * @returns {void}
   */
  openShowUserDialog(ownerId: string): void {
    let user = this.dataService.getUserById(ownerId);
    if (!user) return
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }

}
