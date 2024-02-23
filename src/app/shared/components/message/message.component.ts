import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ChannelMessage } from '../../models/channel-message.class';
import { User } from '../../models/user.class';
import { DialogShowUserComponent } from '../dialogs/dialog-show-user/dialog-show-user.component';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Reply } from '../../models/reply.class';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { DialogEmojiComponent } from '../dialogs/dialog-emoji/dialog-emoji.component';
import { ElementPos, PositionService } from '../../../shared/services/position.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnChanges {

  @Input() msg!: ChannelMessage | Reply;
  @Input() channelMsg!: ChannelMessage;
  @Input() index!: number;
  @Input() user!: User;
  @Input() isChannelMsg: Boolean = false;
  @Input() isEditDisabled: Boolean = false;

  @Output() threadOutput: EventEmitter<ChannelMessage> = new EventEmitter<ChannelMessage>();

  @ViewChild('msgText') msgText!: ElementRef;
  @ViewChild('emoijBtn') emoijBtn!: ElementRef;

  replaies: Reply[] = [];

  isEditMsg = false;
  isSaveEnable = false;
  currentUserID: string;
  oldText: string = '';

  constructor(
    public dialog: MatDialog,
    private messageFBS: ChannelMessagesService,
    private data: DataService,
    private PositionService: PositionService) {
    this.currentUserID = data.currentUserID;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.msg instanceof ChannelMessage) this.replaies = this.msg.replies;
    }
  }


  setTime(timestemp: number): string {
    let date = new Date(timestemp);
    return date.getHours() + ':' + date.getMinutes()
  }


  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: user },
    });
  }


  setThreadOutput() {
    if (this.msg instanceof ChannelMessage) this.threadOutput.emit(this.msg)
    else return
  }


  // edit functions

  editPossible(): boolean {
    if (this.isEditDisabled) return false
    let out;
    if (this.msg instanceof ChannelMessage) (this.msg.fromUserID === this.currentUserID) ? out = true : out = false;
    else (this.msg.userID === this.currentUserID) ? out = true : out = false;
    return out
  }


  toggleEditMsg() {
    this.isEditMsg = !this.isEditMsg;
    this.isEditMsg ? (this.oldText = this.msg.message) : this.isSaveEnable = false;
  }


  checkChange() {
    if (!this.isEditMsg) return
    (this.oldText != this.msgText.nativeElement.value) ? this.isSaveEnable = true : this.isSaveEnable = false;
  }


  openDialogEmoji(): void {
    let pos = this.PositionService.getDialogPos(this.emoijBtn);
    const dialogRef = this.dialog.open(DialogEmojiComponent, {
      position: pos, panelClass: ['card-left-bottom-corner'],
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEmoji(result);
        this.checkChange();
      }
    });
  }


  addEmoji(emoji: string) {
    this.msgText.nativeElement.value = `${this.msgText.nativeElement.value}${emoji}`;
  }


  async deletMsg() {
    this.isEditMsg = false;
    if (this.msg instanceof ChannelMessage) await this.deletChannelMsg(this.msg)
    else await this.deletReplyMsg(this.msg)
  }


  async deletChannelMsg(msg: ChannelMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    else await this.messageFBS.deleteChannelMessage(msg)
  }


  async deletReplyMsg(msg: Reply) {
    if (msg.userID !== this.currentUserID) return
    if (!this.channelMsg) return
    this.channelMsg.replies.splice(this.index, 1)
    await this.messageFBS.updateChannelMessage(this.channelMsg)
  }


  async saveMsg() {
    if (!this.isSaveEnable) return
    this.isSaveEnable = false;
    this.msg.message = this.msgText.nativeElement.value;
    this.isEditMsg = false;
    if (this.msg instanceof ChannelMessage) await this.saveChannelMsg(this.msg);
    else await this.saveReplyMsg(this.msg);
  }


  async saveChannelMsg(msg: ChannelMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    else await this.messageFBS.updateChannelMessage(msg)
    return
  }


  async saveReplyMsg(msg: Reply) {
    if (msg.userID !== this.currentUserID) return
    if (!this.channelMsg) return
    this.channelMsg.replies[this.index] = msg;
    await this.messageFBS.updateChannelMessage(this.channelMsg)
  }

}
