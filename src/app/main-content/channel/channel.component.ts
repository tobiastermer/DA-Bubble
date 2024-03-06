import { Component, OnDestroy } from '@angular/core';
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
import { DataService } from '../../shared/services/data.service';
import { PositionService } from '../../shared/services/position.service';
import { DirectMessage } from '../../shared/models/direct-message.class';
import { DirectMessagesService } from '../../shared/firebase-services/direct-message.service';
import { DialogInfoComponent } from '../../shared/components/dialogs/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';

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
export class ChannelComponent implements OnDestroy {


  currentUser: User;

  chat: 'channel' | 'message' | 'new' = 'channel';
  idChat!: string;

  chatInput: 'channel' | 'message' | 'reply' = 'channel';
  oldTimeStemp!: string;
  newTimeStemp!: string;

  threadMsg: ChannelMessage | DirectMessage | undefined;
  threadChannel: Channel | undefined;

  users: User[] = [];
  channels!: Channel[];

  currentChannelID: string = ''
  currentChannel: Channel = new Channel({ id: 'Channel lädt', name: 'Channel lädt', description: 'Channel lädt', ownerID: 'abcde' });
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  channelMessages: ChannelMessage[] = [];

  directMessages: DirectMessage[] = [];

  chatUser!: User;

  private usersSubscription: Subscription;
  private channelsSubscription: Subscription;

  private channelMembershipSubscription?: Subscription;
  private channelMessagesSubscription?: Subscription;
  private directMessagesSubscription?: Subscription;

  menuOpen: boolean = true; // Standardwert

  constructor(
    private channelService: ChannelService,
    private membershipService: MembershipService,
    private channelMessagesService: ChannelMessagesService,
    private directMessagesService: DirectMessagesService,
    private DataService: DataService,
    private router: ActivatedRoute,
    private positionService: PositionService,
    public dialog: MatDialog,
  ) {

    this.currentUser = this.DataService.currentUser;

    this.router.params.subscribe(params => {
      this.chat = params['chat'];
      this.idChat = params['idChat'];
      if (this.channels) this.loadData(this.chat, this.idChat);
      this.threadMsg = undefined;
    });

    this.usersSubscription = this.DataService.users$.subscribe(users => {
      this.users = users;
    });

    this.channelsSubscription = this.DataService.channels$.subscribe(channels => {
      this.channels = channels;
      this.loadData(this.chat, this.idChat);
    });

    this.positionService.isMenuOpen().subscribe(open => {
      this.menuOpen = open;
    });
  }


  ngOnDestroy() {
    this.channelMembershipSubscription?.unsubscribe();
    this.channelMessagesSubscription?.unsubscribe();
    this.directMessagesSubscription?.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.channelsSubscription.unsubscribe();
  }


  loadData(chat: 'channel' | 'message' | 'new', idChat: string) {
    if (chat === 'channel') return this.channelData(idChat);
    if (chat === 'message') return this.directData(idChat);
  }


  channelData(idChat: string) {
    this.currentChannelID = this.getChannelIdByName(idChat);
    this.loadChannelData();
    this.chatInput = 'channel';
  }


  getChannelIdByName(name: string): string {
    const channel = this.channels.find(channel => channel.name === name);
    return channel ? channel.id : '';
  }


  async loadChannelData() {
    if (this.currentChannelID === '') return
    this.loadMemberships();
    this.loadMessages();
    await this.fetchCurrentChannel();
    this.populateCurrentChannelMembers();
  }


  loadMemberships() {
    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.membershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
    });
  }


  loadMessages() {
    this.channelMessagesService.getChannelMessages(this.currentChannelID);
    this.channelMessagesSubscription = this.channelMessagesService.channelMessages$.subscribe(channelMessages => {
      this.channelMessages = channelMessages.sort((a, b) => a.date - b.date);
    });
  }


  loadDirectMessages() {
    if (!this.currentUser || !this.currentUser.id) return console.error('current user id is missing');
    if (!this.chatUser || !this.chatUser.id) return console.error('chat user id is missing');
    this.directMessagesService.getDirectMessages(this.currentUser.id, this.chatUser.id);
    this.directMessagesSubscription = this.directMessagesService.directMessages$.subscribe(directMessages => {
      this.directMessages = directMessages.sort((a, b) => a.date - b.date);
    });
  }


  private async fetchCurrentChannel() {
    try {
      const channel = await this.channelService.getChannelByID(this.currentChannelID);
      if (channel) {
        this.currentChannel = channel;
      } else {
        this.openDialogInfo('Channel nicht gefunden');
      }
    } catch (error) {
      this.openDialogInfo('Fehler beim Abrufen des aktuellen Channels')
      console.error('Fehler beim Abrufen des aktuellen Channels:', error);
    }
  }


  populateCurrentChannelMembers() {
    const memberIDs = this.currentChannelMemberships.map(membership => membership.userID);
    this.currentChannelMembers = this.users.filter(user => user.id && memberIDs.includes(user.id));
  }


  directData(idChat: string) {
    this.loadChatUserData(idChat);
    this.loadDirectMessages();
    this.chatInput = 'message';
  }


  getUserFromMessage(message: ChannelMessage | DirectMessage): User {
    const user = this.users.find(user => user.id === message.fromUserID);
    return user ? user : new User;
  }


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


  getChatUserId(): undefined | string {
    if (!this.chatUser) return undefined
    else return this.chatUser.id
  }


  setThreadValues(msg: ChannelMessage | DirectMessage) {
    if (msg instanceof ChannelMessage) this.threadMsg = new ChannelMessage(msg)
    else this.threadMsg = new DirectMessage(msg)
  }


  deletThreadValues(delet: boolean) {
    if (delet) this.threadMsg = undefined;
  }


  checkTimeStemp(time: number): boolean {
    if (this.newTimeStemp && this.channelMessages.length == 1) return true
    this.newTimeStemp = this.getTimeStemp(time);
    if (this.oldTimeStemp === this.newTimeStemp) return false
    this.oldTimeStemp = this.newTimeStemp
    return true
  }


  getTimeStemp(msgTime: number): string {
    let time = new Date(msgTime);
    let toDay = new Date();
    if (time.getUTCFullYear() !== toDay.getFullYear()) return time.toISOString().substring(0, 10)
    if (time.toDateString() === toDay.toDateString()) return 'Heute'
    const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const month = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return weekday[time.getUTCDay()] + ', ' + time.getDate() + ' ' + month[time.getUTCMonth()]
  }


  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }
}