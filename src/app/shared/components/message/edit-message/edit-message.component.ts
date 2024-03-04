import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextOutputComponent } from '../text-output/text-output.component';
import { ChannelMessage } from '../../../models/channel-message.class';
import { Reply } from '../../../models/reply.class';
import { MatDialog } from '@angular/material/dialog';
import { ChannelMessagesService } from '../../../firebase-services/channel-message.service';
import { DataService } from '../../../services/data.service';
import { DialogEmojiComponent } from '../../dialogs/dialog-emoji/dialog-emoji.component';
import { AddEmojiService } from '../../../services/add-emoji.service';
import { StorageService } from '../../../firebase-services/storage.service';
import { DirectMessage } from '../../../models/direct-message.class';

@Component({
  selector: 'app-edit-message',
  standalone: true,
  imports: [
    MatIcon,
    MatProgressBarModule,
    CommonModule,
    TextOutputComponent
  ],
  templateUrl: './edit-message.component.html',
  styleUrl: './edit-message.component.scss'
})
export class EditMessageComponent {

  @ViewChild('msgText') msgText!: ElementRef;

  @Input() msg!: ChannelMessage | DirectMessage | Reply;
  @Input() index!: number;
  @Input() channelMsg!: ChannelMessage;

  @Input() isUserCurrentUser: boolean = false;
  @Input() isEditMsg: boolean = false;

  @Output() closeEvent = new EventEmitter<void>();


  range?: Range;

  currentUserID: string;
  oldText: string = "";

  isSaveEnable = false;
  isLoading = false;


  constructor(
    public dialog: MatDialog,
    private messageFBS: ChannelMessagesService,
    public data: DataService,
    public addEmoji: AddEmojiService,
    private storage: StorageService
  ) {
    data.currentUser.id ? this.currentUserID = data.currentUser.id : this.currentUserID = '';
    if (!data.lastEmojis) this.data.loadLastEmojis()
  }


  closeEdit() {
    if (this.isLoading) return
    this.closeEvent.emit();
  }


  checkChange() {
    if (!this.isEditMsg) return
    (this.oldText != this.msgText.nativeElement.value) ? this.isSaveEnable = true : this.isSaveEnable = false;
  }


  openDialogEmoji(): void {
    const selection = window.getSelection();
    if (selection) this.range = selection.getRangeAt(0);
    if (this.isLoading) return
    this.isLoading = true;
    const dialogRef = this.dialog.open(DialogEmojiComponent, {
      panelClass: ['card-round-corners'],
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.isEditMsg) {
        this.addEmojiToText(result);
        return
      }
      this.isLoading = false;
    });
  }


  addEmojiToText(emoji: string) {
    this.addEmoji.addEmoji(this.range, emoji, this.msgText)
    this.checkChange();
    this.isLoading = false;
  }


  async deletMsg() {
    if (this.isLoading) return
    this.isLoading = true;
    debugger
    if (this.msg.attachmentID) this.storage.deleteDoc(this.msg.attachmentID)
    if (this.msg instanceof ChannelMessage) await this.deletChannelMsg(this.msg)
    // 
    if (this.msg instanceof Reply) await this.deletReplyMsg(this.msg)
    this.isLoading = false;
    this.closeEdit()
  }


  async deletChannelMsg(msg: ChannelMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    for (const reply of msg.replies) {
      if (reply.attachmentID !== '') await this.storage.deleteDoc(reply.attachmentID)
    };
    await this.messageFBS.deleteChannelMessage(msg)
  }


  async deletReplyMsg(msg: Reply) {
    if (msg.userID !== this.currentUserID) return
    if (msg.attachmentID !== '') await this.storage.deleteDoc(msg.attachmentID)
    if (!this.channelMsg) return
    this.channelMsg.replies.splice(this.index, 1)
    await this.messageFBS.updateChannelMessage(this.channelMsg)
  }


  async saveMsg() {
    if (!this.isSaveEnable || this.isLoading) return
    this.isSaveEnable = false;
    this.isLoading = true;
    this.msg.message = this.msgText.nativeElement.innerText.trim();
    if (this.msg instanceof ChannelMessage) await this.saveChannelMsg(this.msg);
    // 
    if (this.msg instanceof Reply) await this.saveReplyMsg(this.msg);
    this.isLoading = false;
    this.closeEdit();
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
