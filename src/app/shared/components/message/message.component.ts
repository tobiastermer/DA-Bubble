import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ChannelMessage } from '../../models/channel-message.class';
import { User } from '../../models/user.class';
import { DialogShowUserComponent } from '../dialogs/dialog-show-user/dialog-show-user.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Reply } from '../../models/reply.class';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';


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
  @Input() user!: User;
  @Input() channelMsg: Boolean = false;
  @Input() currentUserID: String | undefined = '';

  @Output() threadOutput: EventEmitter<ChannelMessage> = new EventEmitter<ChannelMessage>();

  @ViewChild('msgText') msgText!: ElementRef;

  replaies: Reply[] = [];

  editMsg = false;
  saveEnable = false;
  oldText: string = '';

  constructor(public dialog: MatDialog, private messageFBS: ChannelMessagesService) { }


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
    if (this.msg instanceof ChannelMessage) {
      if (this.msg.fromUserID === this.currentUserID) return true
      else return false
    } else {
      if (this.msg.userID === this.currentUserID) return true
      else return false
    }
  }


  toggleEditMsg() {
    this.editMsg = !this.editMsg;
    if (this.editMsg) this.oldText = this.msg.message
    else this.saveEnable = false;
  }


  checkChange() {
    if (!this.editMsg) return
    if (this.oldText != this.msgText.nativeElement.value) this.saveEnable = true;
    else this.saveEnable = false;
  }


  async deletMsg() {
    this.editMsg = false;
    if (this.msg instanceof ChannelMessage) {
      if (this.msg.fromUserID !== this.currentUserID) return
      else await this.messageFBS.deleteChannelMessage(this.msg)
    }
  }


  async saveMsg() {
    if (!this.saveEnable) return
    this.saveEnable = false;
    this.msg.message = this.msgText.nativeElement.value;
    this.editMsg = false;
    if (this.msg instanceof ChannelMessage) {
      if (this.msg.fromUserID !== this.currentUserID) return
      else await this.messageFBS.updateChannelMessage(this.msg)
    }
  }

}
