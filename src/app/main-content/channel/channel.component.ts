import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TimeStempService } from '../../shared/services/time-stemp.service';

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

  isThreadVisible: Boolean = false;
  isChannelVisible: Boolean = true;

  private usersSubscription: Subscription;
  private channelsSubscription: Subscription;

  private channelMembershipSubscription?: Subscription;
  private channelMessagesSubscription?: Subscription;
  private directMessagesSubscription?: Subscription;

  menuOpen: boolean = true;

  constructor(
    private channelService: ChannelService,
    private membershipService: MembershipService,
    private channelMessagesService: ChannelMessagesService,
    private directMessagesService: DirectMessagesService,
    public dataService: DataService,
    public timeStemp: TimeStempService,
    private router: ActivatedRoute,
    private positionService: PositionService,
    public dialog: MatDialog,
  ) {

    this.currentUser = this.dataService.currentUser;

    /**
     * Subscribes to changes in router parameters and updates chat information accordingly.
     * @param {Object} params - The router parameters containing 'chat' and 'idChat'.
     * @returns {void}
     */
    this.router.params.subscribe(params => {
      this.chat = params['chat'];
      this.idChat = params['idChat'];
      if (this.channels) this.loadData(this.chat, this.idChat);
      this.threadMsg = undefined;
    });


    /**
     * Subscribes to changes in the users observable and updates the local users data accordingly.
     * @param {Array} users - The updated array of users received from the observable.
     * @returns {void}
     */
    this.usersSubscription = this.dataService.users$.subscribe(users => {
      this.users = users;
    });


    /**
     * Subscribes to changes in the channels observable and updates the local channels data accordingly.
     * Additionally, triggers data loading based on the provided chat and idChat.
     * @param {Array} channels - The updated array of channels received from the observable.
     * @returns {void}
     */
    this.channelsSubscription = this.dataService.channels$.subscribe(channels => {
      this.channels = channels;
      this.loadData(this.chat, this.idChat);
    });


    /**
     * Subscribes to changes in the menu open status provided by the position service.
     * Updates the local menuOpen flag accordingly.
     * @param {boolean} open - The updated menu open status received from the observable.
     * @returns {void}
     */
    this.positionService.isMenuOpen().subscribe(open => {
      this.menuOpen = open;
    });
  }

  ngOnInit() {
    this.positionService.isThreadWindowVisible().subscribe(isVisible => {
      this.isThreadVisible = isVisible;
    });

    this.positionService.isChannelWindowVisible().subscribe(isVisible => {
      this.isChannelVisible = isVisible;
    });
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.channelMembershipSubscription?.unsubscribe();
    this.channelMessagesSubscription?.unsubscribe();
    this.directMessagesSubscription?.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.channelsSubscription.unsubscribe();
  }


  /**
   * Loads data based on the specified chat type and ID.
   * @param {('channel' | 'message' | 'new')} chat - The type of chat ('channel', 'message', or 'new').
   * @param {string} idChat - The ID of the chat.
   * @returns {void}
   */
  loadData(chat: 'channel' | 'message' | 'new', idChat: string): void {
    if (chat === 'channel') return this.channelData(idChat);
    if (chat === 'message') return this.directData(idChat);
  }


  /**
   * Loads data for a channel with the specified ID.
   * @param {string} idChat - The ID of the channel.
   * @returns {void}
   */
  channelData(idChat: string): void {
    this.currentChannelID = this.getChannelIdByName(idChat);
    this.loadChannelData();
    this.chatInput = 'channel';
  }


  /**
   * Retrieves the ID of a channel based on its name.
   * @param {string} name - The name of the channel.
   * @returns {string} The ID of the channel, or an empty string if not found.
   */
  getChannelIdByName(name: string): string {
    const channel = this.channels.find(channel => channel.name === name);
    return channel ? channel.id : '';
  }


  /**
   * Asynchronously loads data for the current channel.
   * @returns {Promise<void>}
   */
  async loadChannelData(): Promise<void> {
    if (this.currentChannelID === '') return
    this.loadMemberships();
    this.loadMessages();
    await this.fetchCurrentChannel();
    this.populateCurrentChannelMembers();
  }


  /**
   * Loads channel memberships for the current channel.
   * @returns {void}
   */
  loadMemberships(): void {
    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.membershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
    });
  }


  /**
   * Loads messages for the current channel.
   * @returns {void}
   */
  loadMessages(): void {
    this.channelMessagesService.getChannelMessages(this.currentChannelID);
    this.channelMessagesSubscription = this.channelMessagesService.channelMessages$.subscribe(channelMessages => {
      this.channelMessages = channelMessages.sort((a, b) => a.date - b.date);
    });
  }


  /**
   * Loads direct messages between the current user and the chat user.
   * @returns {void}
   */
  loadDirectMessages(): void {
    if (!this.currentUser || !this.currentUser.id) return console.error('current user id is missing');
    if (!this.chatUser || !this.chatUser.id) return console.error('chat user id is missing');
    this.directMessagesService.getDirectMessages(this.currentUser.id, this.chatUser.id);
    this.directMessagesSubscription = this.directMessagesService.directMessages$.subscribe(directMessages => {
      this.directMessages = directMessages.sort((a, b) => a.date - b.date);
    });
  }


  /**
   * Fetches the current channel asynchronously.
   * @returns {Promise<void>}
   */
  private async fetchCurrentChannel(): Promise<void> {
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


  /**
   * Populates the current channel's members based on channel memberships.
   * @returns {void}
   */
  populateCurrentChannelMembers(): void {
    const memberIDs = this.currentChannelMemberships.map(membership => membership.userID);
    this.currentChannelMembers = this.users.filter(user => user.id && memberIDs.includes(user.id));
  }


  /**
   * Loads data for direct messaging with the specified chat ID.
   * @param {string} idChat - The ID of the chat for direct messaging.
   * @returns {void}
   */
  directData(idChat: string): void {
    this.loadChatUserData(idChat);
    this.loadDirectMessages();
    this.chatInput = 'message';
  }


  /**
   * Loads chat user data based on the provided chat ID.
   * @param {string} idChat - The ID of the chat used to retrieve user data.
   * @returns {void}
   */
  loadChatUserData(idChat: string): void {
    let name = idChat.replace(/_/g, ' ');
    let user = this.dataService.getUserByName(name);
    if (user) this.chatUser = user
  }


  /**
   * Retrieves the ID of the chat user, if available.
   * @returns {string | undefined} The ID of the chat user, or undefined if not available.
   */
  getChatUserId(): undefined | string {
    if (!this.chatUser) return undefined
    else return this.chatUser.id
  }


  /**
   * Sets thread values based on the provided message.
   * @param {ChannelMessage | DirectMessage} msg - The message to set thread values from.
   * @returns {void}
   */
  setThreadValues(msg: ChannelMessage | DirectMessage): void {
    if (msg instanceof ChannelMessage) this.threadMsg = new ChannelMessage(msg)
    else this.threadMsg = new DirectMessage(msg)
  }


  /**
   * Deletes thread values if the provided flag is true.
   * @param {boolean} delet - A flag indicating whether to delete thread values.
   * @returns {void}
   */
  deletThreadValues(delet: boolean): void {
    if (delet) this.threadMsg = undefined;
  }


  /**
   * Checks whether the timestamp should be displayed based on the provided time.
   * @param {number} time - The timestamp to check.
   * @returns {boolean} A boolean indicating whether the timestamp should be displayed.
   */
  checkTimeStemp(time: number): boolean {
    if (this.newTimeStemp && this.channelMessages.length == 1) return true
    this.newTimeStemp = this.timeStemp.getTimeStemp(time);
    if (this.oldTimeStemp === this.newTimeStemp) return false
    this.oldTimeStemp = this.newTimeStemp
    return true
  }


  /**
   * Opens a dialog window displaying the provided information.
   * @param {string} info - The information to display in the dialog.
   * @returns {void}
   */
  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }
}