import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class ThreadsComponent {

  @Input() channelMsg!: ChannelMessage | undefined;
  @Input() channel!: Channel | undefined;
  @Input() currentChannelMembers: User[] = [];

  @Output() closeThread: EventEmitter<boolean>= new EventEmitter<boolean>();

  constructor(public data: DataService) { }

  setCloseTread(){
    this.closeThread.emit(true)
  }
}
