import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChannelMessage } from '../../models/channel-message.class';
import { DataService } from '../../services/data.service';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { Channel } from '../../models/channel.class';
import { Reply } from '../../models/reply.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatDialog } from '@angular/material/dialog';
import { PositionService } from '../../../shared/services/position.service';
import { DialogEmojiComponent } from '../dialogs/dialog-emoji/dialog-emoji.component';
import { User } from '../../models/user.class';
import { DialogAtUserComponent } from '../dialogs/dialog-at-user/dialog-at-user.component';
import { AddEmojiService } from '../../services/add-emoji.service';
import { FileService } from '../../services/file.service';
import { DirectMessage } from '../../models/direct-message.class';
import { DirectMessagesService } from '../../firebase-services/direct-message.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { DialogsService } from '../../services/dialogs.service';


@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
    MatProgressBarModule,
    CommonModule
  ],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {

  @Input() channel!: Channel | undefined;
  @Input() msg!: ChannelMessage | DirectMessage;
  @Input() chat: 'channel' | 'message' | 'reply' = 'channel';
  @Input() chatUserId!: string | undefined;
  @Input() members: User[] = [];

  @ViewChild('messageText') messageText!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('emoijBtn') emoijBtn!: ElementRef;
  @ViewChild('atUser') atUser!: ElementRef;

  isButtonDisabled: boolean = true;
  isEmojiPickerVisible: boolean = false;
  isLoading: boolean = false;

  range?: Range;

  currentMemberIDs: string[] = [];
  tempFile: any;



  constructor(
    private data: DataService,
    private channelMsgService: ChannelMessagesService,
    private directMsgService: DirectMessagesService,
    private PositionService: PositionService,
    public dialog: MatDialog,
    public addEmoji: AddEmojiService,
    private fileService: FileService,
    public dialogService: DialogsService
  ) { }


  /**
   * Updates the state of the send button based on the message text and file attachment.
   */
  updateButtonState() {
    if (this.isLoading) return this.isButtonDisabled = true;
    if (this.messageText && this.messageText.nativeElement.innerText.trim()) return this.isButtonDisabled = false;
    if (this.tempFile) return this.isButtonDisabled = false;
    return this.isButtonDisabled = true;
  }


  /**
   * Handles the backspace key press event to delete temporary file attachment.
   * @param {Event} event - The keyboard event.
   */
  onDelete(event: Event) {
    if (!(event instanceof KeyboardEvent)) return
    if (event.key !== 'Backspace') return
    if (!this.messageText.nativeElement.querySelector('#uploadFile')) return
    setTimeout(() => {
      if (!this.messageText.nativeElement.querySelector('#uploadFile')) {
        this.tempFile = undefined;
        if (this.fileInput) this.fileInput.nativeElement.value = '';
        this.updateButtonState();
      }
    }, 5);
  }


  /**
   * Handles the enter key press event to send the message.
   * @param {Event} event - The keyboard event.
   * @param {string} textValue - The text value of the message.
   */
  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return
    event.preventDefault();
    if (textValue.trim()) {
      this.addNewMsg(textValue.trim());
      if (this.messageText) this.messageText.nativeElement.innerText = '';
    }
  }


  /**
   * Adds a new message based on the chat type.
   * @param {string} text - The text of the message.
   */
  addNewMsg(text: string) {
    this.isLoading = true;
    this.isButtonDisabled = true;
    if (this.chat === 'channel') this.addNewChannelMsg(text)
    if (this.chat === 'message') this.addNewDirectMsg(text)
    if (this.chat === 'reply') this.addNewReplyMsg(text)
  }


  /**
   * Unsets the loading state after sending the message.
   */
  unsetLoading() {
    this.isLoading = false;
    this.updateButtonState();
  }


  /**
   * Adds a new channel message with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   */
  async addNewChannelMsg(text: string) {
    let newMsg: ChannelMessage | undefined = await this.fillChannelMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.channelMsgService.addChannelMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.channelMsgService.updateChannelMessage(newMsg);
    this.unsetLoading();
  }


  /**
   * Fills a channel message object with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   * @returns {Promise<ChannelMessage | undefined>} The filled channel message object.
   */
  async fillChannelMsg(text: string): Promise<ChannelMessage | undefined> {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let msg = new ChannelMessage();
    msg.date = new Date().getTime();
    msg.channelID = this.channel.id;
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text.replace(/^\n+/, '');
    msg.attachmentID = await this.fileService.uploadFile(this.tempFile);
    return msg
  }


  /**
   * Adds a new direct message with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   */
  async addNewDirectMsg(text: string) {
    let newMsg: DirectMessage | undefined = await this.fillDirectMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.directMsgService.addDirectMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.directMsgService.updateDirectMessage(newMsg);
    this.unsetLoading();
  }


  /**
   * Fills a direct message object with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   * @returns {Promise<DirectMessage | undefined>} The filled direct message object.
   */
  async fillDirectMsg(text: string): Promise<DirectMessage | undefined> {
    if (!this.data.currentUser.id) return
    if (!this.chatUserId) return
    let msg = new DirectMessage();
    msg.date = new Date().getTime();
    msg.userIDs = [this.data.currentUser.id, this.chatUserId];
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text.replace(/^\n+/, '');
    if (this.tempFile) msg.attachmentID = await this.fileService.uploadFile(this.tempFile);
    return msg
  }


  /**
   * Adds a new reply message with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   */
  async addNewReplyMsg(text: string) {
    let newReply: Reply | undefined = await this.fillReplyMsg(text)
    if (!newReply || !this.msg) return
    this.msg.replies.push(newReply);
    if (this.msg instanceof DirectMessage) await this.directMsgService.updateDirectMessage(this.msg);
    else await this.channelMsgService.updateChannelMessage(this.msg);
    this.unsetLoading();
  }


  /**
   * Fills a reply message object with the provided text and optional file attachment.
   * @param {string} text - The text content of the message.
   * @returns {Promise<Reply | undefined>} The filled reply message object.
   */
  async fillReplyMsg(text: string): Promise<Reply | undefined> {
    if (!this.data.currentUser.id) return
    if ((!this.channel || this.channel.id === '') && this.msg instanceof ChannelMessage) return
    let reply = new Reply();
    reply.date = new Date().getTime();
    if (this.msg instanceof ChannelMessage && this.channel) reply.channelID = this.channel.id;
    reply.userID = this.data.currentUser.id;
    reply.message = text.replace(/^\n+/, '');
    reply.attachmentID = await this.fileService.uploadFile(this.tempFile);
    return reply
  }


  /**
   * Opens the dialog for selecting users to mention in the message text.
   */
  openDialogAtUser(): void {
    let pos;
    if (this.chat === 'reply') pos = this.PositionService.getDialogPosWithCorner(this.atUser, 'bottom-left', -100);
    else pos = this.PositionService.getDialogPosWithCorner(this.atUser, 'bottom-left');
    this.currentMemberIDs = this.members.map(user => user.id!);
    const dialogRef = this.dialog.open(DialogAtUserComponent,
      this.dialogService.atUserProp(this.currentMemberIDs, this.channel, pos));
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addUserToMessageText(result);
    });
  }


  /**
   * Adds users to the message text.
   * @param {User[]} users - The array of users to add.
   */
  addUserToMessageText(users: User[]) {
    if (!this.messageText) return;
    this.appendChildForAllUsers(users)
    if (!this.range) return
    this.addEmoji.setCurserToEndPos(this.range);
  }


  /**
   * Appends user mentions to the message text.
   * @param {User[]} users - The array of users to mention.
   */
  appendChildForAllUsers(users: User[]) {
    users.forEach((user, index) => {
      let span = document.createElement('span');
      span.contentEditable = 'false';
      span.innerText = '@' + user.name;
      span.style.color = 'blue';
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => this.openShowUserDialog(user));
      this.messageText.nativeElement.appendChild(span)
      this.messageText.nativeElement.appendChild(document.createTextNode(' '))
    });
  }


  /**
   * Opens the dialog to show user details.
   * @param {User} user - The user whose details to show.
   */
  openShowUserDialog(user: User) {
    this.dialogService.showUserDialog(user, undefined)
  }
  

  /**
   * Opens the dialog for selecting an emoji.
   */
  openDialogEmoji(): void {
    const selection = window.getSelection();
    if (selection) this.range = selection.getRangeAt(0);
    let pos = this.PositionService.getDialogPosEmojy(this.emoijBtn);
    const dialogRef = this.dialog.open(DialogEmojiComponent, 
      this.dialogService.emojiProp(pos));
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.addEmoji.addEmoji(this.range, result, this.messageText);
      this.updateButtonState();
    });
  }


  /**
   * Selects a file for attachment.
   * @param {any} event - The file input change event.
   */
  selectFile(event: any) {
    if (this.tempFile) this.changeFile();
    this.fileService.element = this.messageText;
    this.tempFile = this.fileService.onFileSelected(event);
    this.updateButtonState();
  }


  /**
   * Changes the attached file.
   */
  changeFile() {
    let uploadFileElement = this.messageText.nativeElement.querySelector('#uploadFile');
    if (uploadFileElement) {
      let parentElement = uploadFileElement.parentElement;
      parentElement.removeChild(uploadFileElement);
    }
    this.tempFile = undefined;
  }

}
