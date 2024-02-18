import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderChannelComponent } from './header/header-channel/header-channel.component';
import { ChannelMsgComponent } from './chat/channel-msg/channel-msg.component';
import { DirectMessageComponent } from './header/direct-message/direct-message.component';
import { DirectMsgComponent } from './chat/direct-msg/direct-msg.component';
import { InputTextareaComponent } from '../../shared/components/input-textarea/input-textarea.component';
import { User } from '../../shared/models/user.class';
import { Channel } from '../../shared/models/channel.class';
import { ChannelService } from '../../shared/firebase-services/channel.service';
import { Membership } from '../../shared/models/membership.class';
import { MembershipService } from '../../shared/firebase-services/membership.service';
import { Subscription } from 'rxjs';
import { HeaderNewMsgComponent } from './header/header-new-msg/header-new-msg.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatCardModule,
    HeaderChannelComponent,
    ChannelMsgComponent,
    DirectMessageComponent,
    DirectMsgComponent,
    HeaderNewMsgComponent,

    InputTextareaComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() users: User[] = [];
  @Input() currentUser: User = new User({ id: 'User lädt', name: 'User lädt', avatar: 1, email: 'User lädt', status: '' })

  chat: 'channel' | 'message' | 'new' = 'new';

  currentChannelID: string = 'NgbOpyfDLsZOQSBzLK3B'
  currentChannel: Channel = new Channel({ id: 'Channel lädt', name: 'Channel lädt', description: 'Channel lädt', ownerID: 'abcde' });
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];

  private channelMembershipSubscription?: Subscription;

  constructor(private channelService: ChannelService,
    private membershipService: MembershipService) {

    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.membershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
      console.log('Members of current Channel: ', this.currentChannelMemberships);
    });

  }

  async ngOnInit() {
    await this.fetchCurrentChannel();
    this.populateCurrentChannelMembers();
  }

  ngOnDestroy() {
    this.channelMembershipSubscription?.unsubscribe();
  }

  private async fetchCurrentChannel() {
    try {
      const channel = await this.channelService.getChannelByID(this.currentChannelID);
      if (channel) {
        this.currentChannel = channel;
      } else {
        console.log('Channel nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des aktuellen Channels:', error);
    }
  }

  populateCurrentChannelMembers() {
    const memberIDs = this.currentChannelMemberships.map(membership => membership.userID);
    this.currentChannelMembers = this.users.filter(user => user.id && memberIDs.includes(user.id));
  }

}
