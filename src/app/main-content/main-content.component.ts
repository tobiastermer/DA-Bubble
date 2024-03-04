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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, MenueComponent, ChannelComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {
  users: User[] = [];
  channels: Channel[] = [];
  userMemberships: Membership[] = [];
  currentUserChannels: Channel[] = [];

  // wird später dynamisiert
  currentUserID: string = 's4vgY2BWfL0LIKBJIEOQ';
  currentUser: User;

  // general data
  private usersSubscription?: Subscription;
  private channelsSubscription?: Subscription;

  // current user data
  private userMembershipSubscription?: Subscription;
  private userChannelsSubscription: Subscription = new Subscription();

  constructor(private userService: UserService,
    private membershipService: MembershipService,
    private channelService: ChannelService,
    private dataService: DataService,
    private router: ActivatedRoute) {

    this.currentUser = this.dataService.currentUser;

    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.users = users;
      this.dataService.users = users;
      this.dataService.setUsers(users);
    });

    this.channelsSubscription = this.channelService.channels$.subscribe(channels => {
      this.channels = channels;
      this.dataService.channels = channels;
      this.dataService.setChannels(channels);
    });

    if(this.currentUser) {
      this.membershipService.getUserMemberships(this.currentUser.id);
      this.userMembershipSubscription = this.membershipService.userMemberships$.subscribe(userMemberships => {
        this.userMemberships = userMemberships;
      });
    }
  }

  ngOnInit() {
    this.dataService.logCurrentUserData();
    this.subscribeToUserChannels();
  }

  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
    this.userMembershipSubscription?.unsubscribe();
    this.channelsSubscription?.unsubscribe();
    this.userChannelsSubscription?.unsubscribe();
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

  // private async fetchCurrentUser() {
  //   try {
  //     const user = await this.userService.getUserByID(this.currentUserID);
  //     if (user) {
  //       this.currentUser = user;
  //       this.dataService.currentUser = user;
  //     } else {
  //       console.log('Benutzer nicht gefunden');
  //     }
  //   } catch (error) {
  //     console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
  //   }
  // }

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
