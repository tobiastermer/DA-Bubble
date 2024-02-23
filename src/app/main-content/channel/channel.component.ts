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
import { MessageComponent } from '../../shared/components/message/message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ThreadsComponent,
    HeaderChannelComponent,
    ChannelMsgComponent,
    DirectMessageComponent,
    DirectMsgComponent,
    HeaderNewMsgComponent,
    InputTextareaComponent,
    MessageComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input() users: User[] = [];
  @Input() channels: Channel[] = [];
  @Input() currentUser: User = new User({ id: 'User lädt', name: 'User lädt', avatar: 1, email: 'User lädt', status: '' });

  chat: 'channel' | 'message' | 'new' = 'channel';
  oldTimeStemp!: string;
  newTimeStemp!: string;

  threadMsg: ChannelMessage | undefined;
  threadChannel: Channel | undefined;

  currentChannelID: string = ''
  currentChannel: Channel = new Channel({ id: 'Channel lädt', name: 'Channel lädt', description: 'Channel lädt', ownerID: 'abcde' });
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  channelMessages: ChannelMessage[] = [];

  chatUser!: User;

  private channelMembershipSubscription?: Subscription;
  private channelMessagesSubscription?: Subscription;


  constructor(private channelService: ChannelService,
    private membershipService: MembershipService,
    private channelMessagesService: ChannelMessagesService,
    private router: ActivatedRoute,
  ) {

    this.router.params.subscribe(params => {
      this.chat = params['chat'];
      this.loadData(this.chat, params['idChat']);
      this.threadMsg = undefined;
    });
  }


  getChannelIdByName(name: string): string {
    const channel = this.channels.find(channel => channel.name === name);
    return channel ? channel.id : '';
  }


  loadData(chat: 'channel' | 'message' | 'new', idChat: string) {
    if (chat === 'channel') {
      this.currentChannelID = this.getChannelIdByName(idChat);
      this.loadChannelData();
      return
    }
    if (chat === 'message') {
      this.loadChatUserData(idChat);
    }
    if (chat === 'new') { }

  }


  checkTimeStemp(time:number): boolean{
    this.newTimeStemp = this.getTimeStemp(time);
    if (this.oldTimeStemp === this.newTimeStemp) return false
    this.oldTimeStemp = this.newTimeStemp
    return true
  }


  getTimeStemp(msgTime: number): string{
    let time = new Date(msgTime);
    let toDay = new Date();
    if (time.getUTCFullYear() !== toDay.getFullYear()) return time.toISOString().substring(0, 10)
    if (time.toDateString() === toDay.toDateString()) return 'Heute'
    const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const month = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return weekday[time.getUTCDay()] + ', ' + time.getDate() + ' ' + month[time.getUTCMonth()]
  }


  // Functions for Channel 
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
      // console.log('Members of current Channel: ', this.currentChannelMemberships);
    });
  }


  loadMessages() {
    this.channelMessagesService.getChannelMessages(this.currentChannelID);
    this.channelMessagesSubscription = this.channelMessagesService.channelMessages$.subscribe(channelMessages => {
      this.channelMessages = channelMessages.sort((a, b) => a.date - b.date);
    });
  }


  private async fetchCurrentChannel() {
    try {
      const channel = await this.channelService.getChannelByID(this.currentChannelID);
      if (channel) {
        this.currentChannel = channel;
      } else {
        console.error('Channel nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des aktuellen Channels:', error);
    }
  }


  populateCurrentChannelMembers() {
    const memberIDs = this.currentChannelMemberships.map(membership => membership.userID);
    this.currentChannelMembers = this.users.filter(user => user.id && memberIDs.includes(user.id));
  }


  getUserFromMessage(message: ChannelMessage): User {
    const user = this.users.find(user => user.id === message.fromUserID);
    return user ? user : new User;
  }


  // Functions for direct messeges
  loadChatUserData(idChat: string) {
    let name = idChat.replace(/_/g, ' ');
    let user = this.getUserByName(name);
    if (user) this.chatUser = user
  }


  getUserByName(name: string): User | undefined {
    const user = this.users.find(user => user.name === name);
    if (user) return user;
    else return
  }



  setThreadValues(msg: ChannelMessage) {
    this.threadMsg = new ChannelMessage(msg)
    this.threadChannel = new Channel(this.channels.find(channel => channel.id === this.threadMsg?.channelID));
  }


  deletThreadValues(delet: boolean) {
    if (delet) this.threadMsg = undefined;
  }


  ngOnDestroy() {
    this.channelMembershipSubscription?.unsubscribe();
    this.channelMessagesSubscription?.unsubscribe();
  }
}
