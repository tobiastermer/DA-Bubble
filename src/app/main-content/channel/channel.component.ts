import { Component, Input, input } from '@angular/core';
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
import { ChannelMessage } from '../../shared/models/channel-message.class';
import { ChannelMessagesService } from '../../shared/firebase-services/channel-message.service';
import { ActivatedRoute } from '@angular/router';
import { ThreadsComponent } from './threads/threads.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatCardModule,
    ThreadsComponent,
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
  @Input() channels: Channel[] = [];
  @Input() currentUser: User = new User({ id: 'User lädt', name: 'User lädt', avatar: 1, email: 'User lädt', status: '' });


  chat: 'channel' | 'message' | 'new' = 'channel';
  currentChannelID: string = ''
  currentChannel: Channel = new Channel({ id: 'Channel lädt', name: 'Channel lädt', description: 'Channel lädt', ownerID: 'abcde' });
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  channelMessages: ChannelMessage[] = [];

  private channelMembershipSubscription?: Subscription;
  private channelMessagesSubscription?: Subscription;

  constructor(private channelService: ChannelService,
    private membershipService: MembershipService,
    private channelMessagesService: ChannelMessagesService,
    private router: ActivatedRoute,
  ) {

    this.router.params.subscribe(params => {
      this.chat = params['chat'];
      this.currentChannelID = this.getChannelIdByName(params['idChat']);
      this.loadData(this.chat);
    });
  }


  getChannelIdByName(name: string): string {
    const channel = this.channels.find(channel => channel.name === name);
    return channel ? channel.id : '';
  }


  loadData(chat: 'channel' | 'message' | 'new') {
    if (chat === 'channel') {
      this.loadChannelData();
      return
    }
    if (chat === 'message') { }
    if (chat === 'new') { }

  }


  async loadChannelData() {
    this.ngOnDestroy();
    if (this.currentChannelID !== '') {
      this.loadMemberships();
      this.loadMessages();
      await this.fetchCurrentChannel();
      this.populateCurrentChannelMembers();
    }
  }


  loadMemberships() {
    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.membershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
      console.log('Members of current Channel: ', this.currentChannelMemberships);
    });
  }


  loadMessages() {
    this.channelMessagesService.getChannelMessages(this.currentChannelID);
    this.channelMessagesSubscription = this.channelMessagesService.channelMessages$.subscribe(channelMessages => {
      this.channelMessages = channelMessages;
      console.log('Channel Messages of current Channel: ', this.channelMessages);
    });
  }


  ngOnDestroy() {
    this.channelMembershipSubscription?.unsubscribe();
    this.channelMessagesSubscription?.unsubscribe();
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
