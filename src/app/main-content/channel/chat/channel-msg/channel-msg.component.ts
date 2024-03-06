import { Component, Input, OnDestroy } from '@angular/core';
import { Channel } from '../../../../shared/models/channel.class';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../../../shared/firebase-services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../shared/services/data.service';

@Component({
  selector: 'app-channel-msg',
  standalone: true,
  imports: [],
  templateUrl: './channel-msg.component.html',
  styleUrl: './channel-msg.component.scss'
})
export class ChannelMsgComponent {

  @Input() channel: Channel = new Channel({});
  @Input() owner!: string;
  @Input() createDate!: number;

  currentChannelID: string = '';


  // private idChat: string = '';
  // private channelsSubscription: Subscription;

  constructor(
    private DataService: DataService
    ) { }


  getDateOfTimestemp(time: number | undefined): string {
    if (!time) return ''
    else {
      let date = new Date(time);
      let months = ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dec.'];
      let day = date.getDay();
      let month = months[date.getMonth()];
      let year = date.getFullYear();
      return day + ' ' + month + ' ' + year
    }
  }

}
