import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../../../shared/components/input-textarea/input-textarea.component';
import { ChannelMessage } from '../../../shared/models/channel-message.class';
import { Channel } from '../../../shared/models/channel.class';
import { MessageComponent } from '../../../shared/components/message/message.component';
import { DataService } from '../../../shared/services/data.service';
import { User } from '../../../shared/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../../shared/components/dialogs/dialog-info/dialog-info.component';

@Component({
  selector: 'app-threads',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    CommonModule,
    MatCardModule,
    MessageComponent,
    InputTextareaComponent,

  ],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
})
export class ThreadsComponent implements OnChanges {

  channel!: Channel | undefined;

  @Input() channelMsg!: ChannelMessage | undefined;
  @Input() currentChannelMembers: User[] = [];

  @Output() closeThread: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public data: DataService,
    public dialog: MatDialog,) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.channelMsg?.channelID) {
        this.channel = this.data.channels.find(channel => channel.id === this.channelMsg?.channelID);
        if (!this.channel) return this.openDialogInfo('Kein Channel gefunden');
      }
    }
  }


  setCloseTread() {
    this.closeThread.emit(true)
  }


  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }
}
