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
import { DirectMessagesService } from '../../../firebase-services/direct-message.service';
import { DialogsService } from '../../../services/dialogs.service';

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
  @Input() channelMsg!: ChannelMessage | DirectMessage;

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
    private channelMsgService: ChannelMessagesService,
    private directMsgService: DirectMessagesService,
    public data: DataService,
    public addEmoji: AddEmojiService,
    private storage: StorageService,
    private dialogService: DialogsService
  ) {
    data.currentUser.id ? this.currentUserID = data.currentUser.id : this.currentUserID = '';
    if (!data.lastEmojis) this.data.loadLastEmojis()
  }


  /**
   * Closes the edit message dialog if not in loading state.
   */
  closeEdit() {
    if (this.isLoading) return
    this.closeEvent.emit();
  }


  /**
   * Checks if there's a change in the message text.
   */
  checkChange() {
    if (!this.isEditMsg) return
    (this.oldText != this.msgText.nativeElement.value) ? this.isSaveEnable = true : this.isSaveEnable = false;
  }


  /**
   * Opens the dialog for selecting an emoji.
   */
  openDialogEmoji(): void {
    const selection = window.getSelection();
    if (selection) this.range = selection.getRangeAt(0);
    if (this.isLoading) return
    this.isLoading = true;
    const dialogRef = this.dialog.open(DialogEmojiComponent,  
      this.dialogService.emojiProp());
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.isEditMsg) {
        this.addEmojiToText(result);
        return
      }
      this.isLoading = false;
    });
  }


  /**
   * Adds an emoji to the message text.
   * @param {string} emoji - The emoji to add.
   */
  addEmojiToText(emoji: string) {
    this.addEmoji.addEmoji(this.range, emoji, this.msgText)
    this.checkChange();
    this.isLoading = false;
  }


  /**
   * Deletes the current message if not in loading state.
   */
  async deletMsg() {
    if (this.isLoading) return
    this.isLoading = true;
    if (this.msg.attachmentID) this.storage.deleteDoc(this.msg.attachmentID)
    if (this.msg instanceof ChannelMessage) await this.deletChannelMsg(this.msg)
    if (this.msg instanceof DirectMessage) await this.deletDirectMsg(this.msg)
    if (this.msg instanceof Reply) await this.deletReplyMsg(this.msg)
    this.isLoading = false;
    this.closeEdit()
  }


  /**
   * Deletes a channel message.
   * @param {ChannelMessage} msg - The channel message to delete.
   */
  async deletChannelMsg(msg: ChannelMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    for (const reply of msg.replies) {
      if (reply.attachmentID !== '') await this.storage.deleteDoc(reply.attachmentID)
    };
    await this.channelMsgService.deleteChannelMessage(msg)
  }


  /**
   * Deletes a direct message.
   * @param {DirectMessage} msg - The direct message to delete.
   */
  async deletDirectMsg(msg: DirectMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    for (const reply of msg.replies) {
      if (reply.attachmentID !== '') await this.storage.deleteDoc(reply.attachmentID)
    };
    await this.directMsgService.deleteDirectMessage(msg)
  }


  /**
   * Deletes a reply message.
   * @param {Reply} msg - The reply message to delete.
   */
  async deletReplyMsg(msg: Reply) {
    if (msg.userID !== this.currentUserID) return
    if (msg.attachmentID !== '') await this.storage.deleteDoc(msg.attachmentID)
    if (!this.channelMsg) return
    this.channelMsg.replies.splice(this.index, 1)
    if (this.channelMsg instanceof ChannelMessage) await this.channelMsgService.updateChannelMessage(this.channelMsg)
    else (await this.directMsgService.updateDirectMessage(this.channelMsg))
  }


  /**
   * Saves the edited message if there are changes and not in loading state.
   */
  async saveMsg() {
    if (!this.isSaveEnable || this.isLoading) return
    this.isSaveEnable = false;
    this.isLoading = true;
    this.msg.message = this.msgText.nativeElement.innerText.trim();
    if (this.msg instanceof ChannelMessage) await this.saveChannelMsg(this.msg);
    if (this.msg instanceof DirectMessage) await this.saveDirectMsg(this.msg);
    if (this.msg instanceof Reply) await this.saveReplyMsg(this.msg);
    this.isLoading = false;
    this.closeEdit();
  }


  /**
   * Saves a channel message if the current user is the sender.
   * @param {ChannelMessage} msg - The channel message to save.
   */
  async saveChannelMsg(msg: ChannelMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    else await this.channelMsgService.updateChannelMessage(msg)
    return
  }


  /**
   * Saves a direct message if the current user is the sender.
   * @param {DirectMessage} msg - The direct message to save.
   */
  async saveDirectMsg(msg: DirectMessage) {
    if (msg.fromUserID !== this.currentUserID) return
    else await this.directMsgService.updateDirectMessage(msg)
    return
  }


  /**
   * Saves a reply message if the current user is the sender.
   * @param {Reply} msg - The reply message to save.
   */
  async saveReplyMsg(msg: Reply) {
    if (msg.userID !== this.currentUserID) return
    if (!this.channelMsg) return
    this.channelMsg.replies[this.index] = msg;
    if (this.channelMsg instanceof ChannelMessage) await this.channelMsgService.updateChannelMessage(this.channelMsg)
    else await this.directMsgService.updateDirectMessage(this.channelMsg)
  }

}
