import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { ChannelMessage } from '../../models/channel-message.class';
import { User } from '../../models/user.class';
import { Time } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input() msg!: ChannelMessage;
  @Input() user!: User;
  date: Time = {hours:20,minutes:30}






}
