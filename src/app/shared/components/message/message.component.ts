import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ChannelMessage } from '../../models/channel-message.class';
import { User } from '../../models/user.class';
import { DialogShowUserComponent } from '../dialogs/dialog-show-user/dialog-show-user.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


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
export class MessageComponent {

  @Input() msg!: ChannelMessage;
  @Input() user!: User;
  @Input() channelMsg: Boolean = false;
  @Input() currentUserID: String | undefined = '';

  @Output() threadOutput: EventEmitter<ChannelMessage> = new EventEmitter<ChannelMessage>();

  constructor(public dialog: MatDialog) { }

  
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
    this.threadOutput.emit(this.msg)
  }
}
