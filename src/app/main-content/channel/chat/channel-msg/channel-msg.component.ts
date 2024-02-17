import { Component, Input } from '@angular/core';
import { Channel } from '../../../../shared/models/channel.class';

@Component({
  selector: 'app-channel-msg',
  standalone: true,
  imports: [],
  templateUrl: './channel-msg.component.html',
  styleUrl: './channel-msg.component.scss'
})
export class ChannelMsgComponent {

  @Input() channel!: Channel;
  @Input() owner!: string;

}
