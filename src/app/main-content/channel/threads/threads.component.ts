import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../../../shared/components/input-textarea/input-textarea.component';
import { ChannelMessage } from '../../../shared/models/channel-message.class';
import { Channel } from '../../../shared/models/channel.class';
import { MessageComponent } from '../../../shared/components/message/message.component';
import { User } from '../../../shared/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../../../shared/components/dialogs/dialog-info/dialog-info.component';
import { DirectMessage } from '../../../shared/models/direct-message.class';
import { DataService } from '../../../shared/services/data.service';

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

  @Input() chatMsg!: ChannelMessage | DirectMessage | undefined;
  @Input() channels: Channel[] = [];
  @Input() currentChannelMembers: User[] = [];

  @Output() closeThread: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    public data: DataService
  ) { }


  /**
   * Lifecycle hook that is called when any data-bound property of the component changes.
   * It checks for changes in the input properties and updates the component accordingly.
   * If the 'channelID' property changes in the 'chatMsg' object, it retrieves the corresponding channel from the 'channels' array.
   * If no matching channel is found, it opens a dialog with an information message.
   * @param {SimpleChanges} changes - An object containing each changed property.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (!this.chatMsg) return;
      if ('channelID' in this.chatMsg) {
        const channelMsg = this.chatMsg as ChannelMessage;
        if (channelMsg.channelID) this.channel = this.channels.find(channel => channel.id === channelMsg.channelID);
      }
      else return
      if (!this.channel) this.openDialogInfo('Kein Channel gefunden');
    }
  }


  /**
   * Emits a boolean value indicating that the thread should be closed.
   * This method is typically called when an action triggers the closing of a thread.
   * @emits {boolean} true - Indicates that the thread should be closed.
   * @returns {void}
   */
  setCloseTread(): void {
    this.closeThread.emit(true)
  }


  /**
   * Opens a dialog window to display information to the user.
   * @param {string} info - The information message to be displayed in the dialog.
   * @returns {void}
   */
  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }
}
