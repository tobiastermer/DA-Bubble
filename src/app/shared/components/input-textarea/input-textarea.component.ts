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
import { DialogShowUserComponent } from '../dialogs/dialog-show-user/dialog-show-user.component';
import { AuthService } from '../../firebase-services/auth.service';
import { DialogInfoComponent } from '../dialogs/dialog-info/dialog-info.component';
import { AddEmojiService } from '../../services/add-emoji.service';
import { FileService } from '../../services/file.service';
import { DirectMessage } from '../../models/direct-message.class';
import { DirectMessagesService } from '../../firebase-services/direct-message.service';


@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
  ],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {

  @Input() channel!: Channel | undefined;
  @Input() msg!: ChannelMessage;
  @Input() chat: 'channel' | 'message' | 'new' = 'channel';
  @Input() chatUserId!: string | undefined;
  @Input() members: User[] = [];

  @ViewChild('messageText') messageText!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('emoijBtn') emoijBtn!: ElementRef;
  @ViewChild('atUser') atUser!: ElementRef;

  isButtonDisabled: boolean = true;
  isEmojiPickerVisible: boolean = false;

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
    private fileService: FileService
  ) { }


  updateButtonState() {
    if (this.messageText && this.messageText.nativeElement.innerText.trim()) return this.isButtonDisabled = false
    if (this.tempFile) return this.isButtonDisabled = false
    return this.isButtonDisabled = true
  }


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


  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return
    event.preventDefault();
    if (textValue.trim()) {
      this.addNewMsg(textValue.trim());
      if (this.messageText) this.messageText.nativeElement.innerText = '';
    }
  }


  addNewMsg(text: string) {
    if (this.chat === 'channel') this.addNewChannelMsg(text)
    if (this.chat === 'message') this.addNewDirectMsg(text)
    if (this.chat === 'new') this.addNewReplyMsg(text)
  }


  async addNewChannelMsg(text: string) {
    let newMsg: ChannelMessage | undefined = await this.fillChannelMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.channelMsgService.addChannelMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.channelMsgService.updateChannelMessage(newMsg);
  }


  async fillChannelMsg(text: string) {
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


  async addNewReplyMsg(text: string) {
    let newReply: Reply | undefined = await this.fillReplyMsg(text)
    if (!newReply || !this.msg) return
    this.msg.replies.push(newReply);
    await this.channelMsgService.updateChannelMessage(this.msg);
  }


  async fillReplyMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let reply = new Reply();
    reply.date = new Date().getTime();
    reply.channelID = this.channel.id;
    reply.userID = this.data.currentUser.id;
    reply.message = text.replace(/^\n+/, '');
    reply.attachmentID = await this.fileService.uploadFile(this.tempFile);
    return reply
  }


  async addNewDirectMsg(text: string) {
    let newMsg: DirectMessage | undefined = await this.fillDirectMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.directMsgService.addDirectMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.directMsgService.updateDirectMessage(newMsg);
  }


  async fillDirectMsg(text: string) {
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

  
  // @-Part
  openDialogAtUser(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.atUser, 'bottom');
    this.currentMemberIDs = this.members.map(user => user.id!);
    const dialogRef = this.dialog.open(DialogAtUserComponent, {
      position: pos, panelClass: ['card-round-corners'], width: '350px',
      data: { allUsers: this.data.users, currentMemberIDs: this.currentMemberIDs, channel: this.channel },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addUserToMessageText(result);
    });
  }


  addUserToMessageText(users: User[]) {
    if (!this.messageText) return;
    this.appendChildForAllUsers(users)
    if (!this.range) return
    this.addEmoji.setCurserToEndPos(this.range);
  }


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


  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: user },
    });
  }


  openDialogEmoji(): void {
    const selection = window.getSelection();
    if (selection) this.range = selection.getRangeAt(0);
    let pos = this.PositionService.getDialogPosEmojy(this.emoijBtn);
    let classCorner = pos?.right ? 'card-right-bottom-corner' : 'card-left-bottom-corner';
    const dialogRef = this.dialog.open(DialogEmojiComponent, {
      position: pos, panelClass: [classCorner],
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.addEmoji.addEmoji(this.range, result, this.messageText);
      this.updateButtonState();
    });
  }


  selectFile(event: any) {
    if (this.tempFile) this.changeFile();
    this.fileService.element = this.messageText;
    this.tempFile = this.fileService.onFileSelected(event);
    this.updateButtonState();
  }


  changeFile() {
    let uploadFileElement = this.messageText.nativeElement.querySelector('#uploadFile');
    if (uploadFileElement) {
      let parentElement = uploadFileElement.parentElement;
      parentElement.removeChild(uploadFileElement);
    }
    this.tempFile = undefined;
  }

}
