import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenueComponent } from './menue/menue.component';
import { ChannelComponent } from './channel/channel.component';
import { User } from '../shared/models/user.class';
import { UserService } from '../shared/firebase-services/user.service';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MembershipService } from '../shared/firebase-services/membership.service';
import { Membership } from '../shared/models/membership.class';
import { ChannelService } from '../shared/firebase-services/channel.service';
import { Channel } from '../shared/models/channel.class';
import { DataService } from '../shared/services/data.service';
import { PositionService } from '../shared/services/position.service';
import { CommonModule } from '@angular/common';
import { slideInUpAnimationSlow, slideInleftAnimationSlow } from '../shared/services/animations';

/**
 * Represents the main content area of the application, including the header, menu, and channel components.
 * It manages the subscriptions to user and channel data, as well as the visibility of the menu and channel components
 * based on the responsive window size.
 */
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, MenueComponent, ChannelComponent, CommonModule,],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  animations: [
    slideInUpAnimationSlow,
    slideInleftAnimationSlow

  ],
})
export class MainContentComponent implements OnInit {
  users: User[] = [];
  channels: Channel[] = [];
  userMemberships: Membership[] = [];
  currentUserChannels: Channel[] = [];
  isMenuVisible: Boolean = true;
  isChannelVisible: Boolean = false;

  // currentUserID: string = 's4vgY2BWfL0LIKBJIEOQ';
  currentUser: User;

  // general data
  private usersSubscription?: Subscription;
  private channelsSubscription?: Subscription;

  // current user data
  private userMembershipSubscription?: Subscription;
  private userChannelsSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private membershipService: MembershipService,
    private channelService: ChannelService,
    private dataService: DataService,
    private positionService: PositionService,
  ) {

    this.currentUser = this.dataService.currentUser;

    // Subscribe to users and channels data
    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.users = users;
      this.dataService.setUsers(users);
    });

    this.channelsSubscription = this.channelService.channels$.subscribe(channels => {
      this.channels = channels;
      this.dataService.setChannels(channels);
    });

    // Subscribe to user memberships if currentUser is available
    if (this.currentUser) {
      this.membershipService.getUserMemberships(this.currentUser.id);
      this.userMembershipSubscription = this.membershipService.userMemberships$.subscribe(userMemberships => {
        this.userMemberships = userMemberships;
      });
    }
  }

  /**
* Initializes the component by subscribing to user channels and manage responsive window visibility.
*/
  ngOnInit() {
    this.subscribeToUserChannels();

    this.positionService.isResponsiveWindowVisible('menu').subscribe(isVisible => {
      this.isMenuVisible = isVisible;
    });

    this.positionService.isResponsiveWindowVisible('channel').subscribe(isVisible => {
      this.isChannelVisible = isVisible;
    });
  }

  /**
     * Cleans up the component by unsubscribing from the data.
     */
  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
    this.userMembershipSubscription?.unsubscribe();
    this.channelsSubscription?.unsubscribe();
    this.userChannelsSubscription?.unsubscribe();
  }

  /**
    * Subscribes to the channels that the current user is a member of.
    */
  private subscribeToUserChannels() {
    const subscription = combineLatest([
      this.membershipService.userMemberships$,
      this.channelService.channels$
    ]).pipe(
      map(([memberships, channels]) => {
        return channels.filter(channel => memberships.some(membership => membership.channelID === channel.id));
      })
    ).subscribe(filteredChannels => {
      this.dataService.setCurrentUserChannels(filteredChannels);
    });

    this.userChannelsSubscription.add(subscription);
  }

}
