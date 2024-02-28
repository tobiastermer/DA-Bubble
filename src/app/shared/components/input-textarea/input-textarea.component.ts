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
  @Input() channelMsg: Boolean = false;
  @Input() members: User[] = [];

  @ViewChild('messageText') messageText!: ElementRef;
  @ViewChild('emoijBtn') emoijBtn!: ElementRef;
  @ViewChild('atUser') atUser!: ElementRef;

  isButtonDisabled: boolean = true;
  isEmojiPickerVisible: boolean = false;

  range?: Range;

  currentMemberIDs: string[] = [];



  constructor(private data: DataService,
    private messageFBS: ChannelMessagesService,
    private PositionService: PositionService,
    public dialog: MatDialog) { }

  updateButtonState(textValue: string): void {
    this.isButtonDisabled = !textValue.trim();
  }

  /////// INPUT FORM EVENTLISTENDER FOR KEYBOARD ENTER + SHIFT/ENTER///////
  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
    } else {
      event.preventDefault();
      if (textValue.trim()) {
        this.addNewMsg(textValue.trim());
        if (this.messageText) {
          this.messageText.nativeElement.innerText = '';
        }
      }
    }
  }


  addNewMsg(text: string) {
    if (this.channelMsg) this.addNewChannelMsg(text)
    else this.addNewReplyMsg(text)
  }


  async addNewChannelMsg(text: string) {
    let newMsg: ChannelMessage | undefined = this.fillChannelMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.messageFBS.addChannelMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.messageFBS.updateChannelMessage(newMsg);
  }


  fillChannelMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let msg = new ChannelMessage();
    msg.date = new Date().getTime();
    msg.channelID = this.channel.id;
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text;
    return msg
  }


  async addNewReplyMsg(text: string) {
    let newReply: Reply | undefined = this.fillReplyMsg(text)
    if (!newReply || !this.msg) return
    this.msg.replies.push(newReply);
    await this.messageFBS.updateChannelMessage(this.msg);
  }


  fillReplyMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let reply = new Reply();
    reply.date = new Date().getTime();
    reply.channelID = this.channel.id;
    reply.userID = this.data.currentUser.id;
    reply.message = text;
    return reply
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
    let span = this.fillAtUserSpan(users)
    this.messageText.nativeElement.appendChild(span);
    this.setCurserToEndPos()
  }

  fillAtUserSpan(users: User[]) {
    let outSpan = document.createElement('span');
    users.forEach((user, index) => {
      let span = document.createElement('span');
      span.contentEditable = 'false';
      span.innerText = '@' + user.name;
      span.style.color = 'blue';
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => this.openShowUserDialog(user));
      outSpan.appendChild(span);
      if (index !== users.length - 1) outSpan.appendChild(document.createTextNode(' '))
    });
    return outSpan
  }

  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: user },
    });
  }

  // Emoji part

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
      if (result) this.addEmoji(result)
    });
  }


  addEmoji(emoji: string) {
    if (!this.messageText) return;
    if (this.range && this.isCurserAtMessageText()) {
      this.range.insertNode(document.createTextNode(emoji));
      this.setCurserToEndPos();
    } else this.addEmojiToEndOfMessageText(emoji);
  }


  isCurserAtMessageText() {
    return this.range && this.range.commonAncestorContainer.parentElement && this.range.commonAncestorContainer.parentElement.id === 'messageText'
  }


  setCurserToEndPos() {
    if (!this.range) return
    const selection = window.getSelection();
    if (!selection) return;
    const newPosition = this.range.endOffset;
    this.range.setStart(this.messageText.nativeElement, newPosition);
    this.range.setEnd(this.messageText.nativeElement, newPosition);
    selection.removeAllRanges();
    selection.addRange(this.range);
  }


  addEmojiToEndOfMessageText(emoji: string) {
    this.range = document.createRange();
    this.range.setStart(this.messageText.nativeElement, this.messageText.nativeElement.childNodes.length);
    this.range.setEnd(this.messageText.nativeElement, this.messageText.nativeElement.childNodes.length);
    this.range.insertNode(document.createTextNode(emoji));
    this.setCurserToEndPos();
  }
}
