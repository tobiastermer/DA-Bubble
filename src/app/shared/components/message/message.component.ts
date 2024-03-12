import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ChannelMessage } from '../../models/channel-message.class';
import { User } from '../../models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Reply } from '../../models/reply.class';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { DialogEmojiComponent } from '../dialogs/dialog-emoji/dialog-emoji.component';
import { PositionService } from '../../../shared/services/position.service';
import { DataService } from '../../services/data.service';
import { Like, SortedLikes } from '../../models/like.class';
import { TextOutputComponent } from './text-output/text-output.component';
import { EditMessageComponent } from './edit-message/edit-message.component';
import { DirectMessage } from '../../models/direct-message.class';
import { DirectMessagesService } from '../../firebase-services/direct-message.service';
import { DialogsService } from '../../services/dialogs.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    CommonModule,
    TextOutputComponent,
    EditMessageComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnChanges {

  @Input() msg!: ChannelMessage | DirectMessage | Reply;
  @Input() channelMsg!: ChannelMessage | DirectMessage;
  @Input() index!: number;
  @Input() user!: User;
  @Input() isChannelMsg: Boolean = false;
  @Input() isEditDisabled: Boolean = false;

  @Output() threadOutput: EventEmitter<ChannelMessage | DirectMessage> = new EventEmitter<ChannelMessage | DirectMessage>();

  @ViewChild('emoijBtn') emoijBtn!: ElementRef;
  @ViewChild('likesRow') likesRow!: ElementRef;

  allLikes: Like[] = [];
  sortedLikes: SortedLikes[] = [];
  replaies: Reply[] = [];

  isEditMsg = false;
  isEmojiReacOpen = false;
  currentUserID: string;
  oldText: string = '';
  posLikesRow = 2;
  message = '';

  constructor(
    public dialog: MatDialog,
    public dialogService: DialogsService,
    private channelMsgService: ChannelMessagesService,
    private directMsgService: DirectMessagesService,
    public data: DataService,
    private positionService: PositionService) {
    data.currentUser.id ? this.currentUserID = data.currentUser.id : this.currentUserID = '';
    if (!data.lastEmojis) this.data.loadLastEmojis()
  }


  /**
   * Initializes the component by setting default values for the user if not provided.
   */
  ngOnInit() {
    if (!this.user) {
      this.user = new User({
        id: '',
        uid: '',
        email: 'Lädt...',
        name: 'Lädt...',
        avatar: '../../../../../assets/img/avatars/unknown.jpg'
      });
    }
  }


  /**
   * Responds to changes in data-bound properties.
   * @param {SimpleChanges} changes - Object containing previous and current property values of the directive's data-bound properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.allLikes = this.msg.likes;
      this.sortedLikes = this.fillSortedLikes();
      if (this.msg instanceof Reply) return
      this.replaies = this.msg.replies;
    }
  }


  /**
   * Fills the array of sorted likes based on unique emojis.
   * @returns {SortedLikes[]} - The array of sorted likes.
   */
  fillSortedLikes(): SortedLikes[] {
    let uniqueEmojis = this.getUniqueEmojis();
    let sortedLikes: SortedLikes[] = [];
    for (const emoji in uniqueEmojis) {
      if (Object.prototype.hasOwnProperty.call(uniqueEmojis, emoji)) {
        sortedLikes.push({ emoji, usersIDs: uniqueEmojis[emoji] });
      }
    }
    return sortedLikes;
  }


  /**
   * Retrieves unique emojis from the likes.
   * @returns {Record<string, string[]>} - Object containing unique emojis as keys and arrays of user IDs as values.
   */
  getUniqueEmojis() {
    let uniqueEmojis: { [key: string]: string[] } = {};
    this.allLikes.forEach(like => {
      if (!uniqueEmojis[like.emoji]) uniqueEmojis[like.emoji] = [like.userID];
      else if (!uniqueEmojis[like.emoji].includes(like.userID)) {
        uniqueEmojis[like.emoji].push(like.userID);
      }
    });
    return uniqueEmojis
  }


  /**
   * Formats the timestamp into a readable time string.
   * @param {number} timestamp - The timestamp to format.
   * @returns {string} - The formatted time string.
   */
  setTime(timestemp: number): string {
    let date = new Date(timestemp);
    return date.getHours() + ':' + date.getMinutes()
  }


  /**
   * Emits the message to be displayed in the thread.
   */
  setThreadOutput() {
    if (this.msg instanceof ChannelMessage || this.msg instanceof DirectMessage) {
      this.positionService.setThreadResponsiveWindow(true);
      this.threadOutput.emit(this.msg);
    } else {
      return
    }
  }


  /**
   * Sets the message text.
   * @param {string} text - The message text to set.
   */
  setMsgText(text: string) {
    this.message = text;
  }


  /**
   * Checks if editing the message is possible.
   * @returns {boolean} - Indicates whether editing the message is possible.
   */
  editPossible(): boolean {
    if (this.isEditDisabled) return false
    let out = false;
    if (this.msg instanceof ChannelMessage) (this.msg.fromUserID === this.currentUserID) ? out = true : out = false;
    if (this.msg instanceof DirectMessage) (this.msg.fromUserID === this.currentUserID) ? out = true : out = false;
    if (this.msg instanceof Reply) (this.msg.userID === this.currentUserID) ? out = true : out = false;
    return out
  }


  /**
   * Toggles the edit message mode.
   */
  toggleEditMsg() {
    this.isEditMsg = !this.isEditMsg;
  }


  /**
   * Opens the emoji dialog to add a like to the message.
   */
  openDialogEmoji(): void {
    const dialogRef = this.dialog.open(DialogEmojiComponent,
      this.dialogService.emojiProp());
    dialogRef.afterClosed().subscribe(result => {
      if (result && !this.isEditMsg) return this.addLike(result);
      else return
    });
  }


  /**
   * Toggles an emoji reaction for the current message.
   * If the emoji is already reacted by the user, it removes the reaction.
   * If the emoji is not reacted by the user, it adds the reaction.
   * @param emoji The emoji to toggle reaction for.
   * @returns A promise that resolves once the message is updated in the database.
   */
  async toggelEmoji(emoji: string) {
    if (!this.isEmojiReacOpen) return
    let newLike = this.newLike(emoji);
    for (let i = 0; i < this.msg.likes.length; i++) {
      if (this.msg.likes[i].userID === newLike.userID &&
        this.msg.likes[i].emoji === newLike.emoji) return this.deleteEmoji(i)
    }
    this.msg.likes.push(newLike);
    await this.updateMessage();
    this.sortedLikes = this.fillSortedLikes();
  }


  /**
   * Deletes an emoji from the message's likes list at the specified index.
   * @param index The index of the emoji to be deleted from the likes list.
   * @returns A promise that resolves once the message is updated in the database.
   */
  async deleteEmoji(index: number) {
    this.msg.likes.splice(index, 1);
    this.sortedLikes = this.fillSortedLikes();
    return await this.updateMessage();
  }


  /**
   * Adds a like to the message.
   * @param {string} emoji - The emoji to be added as a like.
   */
  async addLike(emoji: string) {
    this.saveEmojiLocal(emoji);
    let newLike = this.newLike(emoji);
    this.msg.likes.push(newLike);
    await this.updateMessage()
    this.sortedLikes = this.fillSortedLikes();
  }


  /**
   * Saves the emoji locally if it is not already in the last emojis list.
   * @param {string} emoji - The emoji to be saved locally.
   */
  saveEmojiLocal(emoji: string) {
    if (this.data.lastEmojis.includes(emoji)) return
    this.data.lastEmojis.push(emoji);
    if (this.data.lastEmojis.length > 2) this.data.lastEmojis.splice(0, (this.data.lastEmojis.length - 2));
    localStorage.setItem('lastEmojis', this.data.lastEmojis.toString())
  }


  /**
   * Creates a new like object.
   * @param {string} emoji - The emoji for the like.
   * @returns {Like} - The newly created like object.
   */
  newLike(emoji: string): Like {
    let like = new Like();
    like.emoji = emoji;
    like.userID = this.currentUserID;
    like.date = new Date().getTime();
    return like
  }


  /**
   * Updates the current message or channel message in the database.
   */
  async updateMessage(): Promise<void> {
    if (this.msg instanceof ChannelMessage) await this.channelMsgService.updateChannelMessage(this.msg);
    else if (this.msg instanceof DirectMessage) await this.directMsgService.updateDirectMessage(this.msg);
    else if (this.channelMsg instanceof ChannelMessage) await this.channelMsgService.updateChannelMessage(this.channelMsg);
    else if (this.channelMsg instanceof DirectMessage) await this.directMsgService.updateDirectMessage(this.channelMsg);
  }


  /**
   * Sets the position of the hidden likes row.
   */
  setHiddenLikePos() {
    let pos = this.positionService.getDialogPosWithCorner(this.likesRow, 'bottom-left');
    if (pos?.bottom) this.posLikesRow = parseInt(pos.bottom);
  }


  /**
   * Handles the event when an image fails to load, setting a default image.
   * @param {Event} event - The event triggered when the image fails to load.
   */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '../../../../assets/img/avatars/unknown.jpg';
  }


  /**
   * Retrieves the user associated with a like by their ID and displays their profile in a dialog.
   * @param {string} id - The ID of the user associated with the like.
   */
  getUserOfLike(id: string) {
    let user = this.data.getUserById(id);
    if (!user) return
    this.dialogService.showUserDialog(user, undefined);
  }


  /**
   * Sets the state of the emoji reaction dialog to open.
   */
  setEmojiReacOpen() {
    this.isEmojiReacOpen = true;
  }


  /**
   * Sets the state of the emoji reaction dialog to closed.
   */
  setEmojiReacClose() {
    this.isEmojiReacOpen = false;
  }
}
