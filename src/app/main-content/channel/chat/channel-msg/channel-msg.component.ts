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
  @Input() createDate!: number;



  getDateOfTimestemp(time: number | undefined): string{
    if (!time) return ''
    else {
      let date = new Date(time);
      let months = ['Jan.','Feb.','Mär.','Apr.','Mai','Jun.','Jul.','Aug.','Sep.','Okt.','Nov.','Dec.'];
      let day = date.getDay();
      let month = months[date.getMonth()];
      let year = date.getFullYear();
      return day+' '+month+' '+year     
    }
  }



}
