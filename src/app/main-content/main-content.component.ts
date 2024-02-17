import { Component, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenueComponent } from './menue/menue.component';
import { ChannelComponent } from './channel/channel.component';
import { ThreadsComponent } from './threads/threads.component';
import { User } from '../shared/models/user.class';
import { UserService } from '../shared/firebase-services/user.service';
import { Subscription } from 'rxjs';
import { MembershipService } from '../shared/firebase-services/membership.service';
import { Membership } from '../shared/models/membership.class';
import { ChannelService } from '../shared/firebase-services/channel.service';
import { Channel } from '../shared/models/channel.class';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, MenueComponent, ChannelComponent, ThreadsComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnDestroy {
  users: User[] = [];
  userMemberships: Membership[] = [];
  channels: Channel[] = [];

  // wird später dynamisiert
  currentUserID: string = 's4vgY2BWfL0LIKBJIEOQ';

  private usersSubscription?: Subscription;
  private userMembershipSubscription?: Subscription;
  private channelsSubscription?: Subscription;

  constructor(private userService: UserService,
    private membershipService: MembershipService,
    private channelService: ChannelService) {

    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });

    this.membershipService.getUserMemberships(this.currentUserID);
    this.userMembershipSubscription = this.membershipService.userMemberships$.subscribe(userMemberships => {
      this.userMemberships = userMemberships;
      console.log('Memberships of current User: ', this.userMemberships);
    });

    this.channelsSubscription = this.channelService.channels$.subscribe(channels => {
      this.channels = channels;
      console.log('Channel: ', this.channels);
    });
  }

  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
    this.userMembershipSubscription?.unsubscribe();
    this.channelsSubscription?.unsubscribe();
  }

  sortedUsers() {
    const currentUser = this.users.find(user => user.id === this.currentUserID);
    const otherUsers = this.users
      .filter(user => user.id !== this.currentUserID)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (currentUser) {
      return [currentUser, ...otherUsers];
    } else {
      return otherUsers;
    }
  }
}
