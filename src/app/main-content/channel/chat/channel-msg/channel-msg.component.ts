import { Component, Input } from '@angular/core';
import { Channel } from '../../../../shared/models/channel.class';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../../../shared/firebase-services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../shared/services/data.service';
import { MembershipService } from '../../../../shared/firebase-services/membership.service';

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

  constructor(
    private MembershipService: MembershipService,
    private DataService: DataService,
    private route: ActivatedRoute,
    private channelService: ChannelService,) {


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const channelName = params['idChat'];
      console.log('ChannelName laut Route ist: ', channelName);

      this.getChannelIdByName(channelName).then(channelId => {
        console.log('ChannelID laut Route ist: ', channelId);
        if (channelId) {
          this.currentChannelID = channelId;
          this.loadChannel(channelId);
        }
      });
    });
  }

  private loadChannel(channelId: string) {
    this.channelService.getChannelByID(channelId).then(channel => {
      if (channel) {
        this.channel = channel;
      } else {
        console.error('Channel nicht gefunden');
      }
    }).catch(error => {
      console.error('Fehler beim Abrufen des Channels:', error);
    });
  }

  getChannelIdByName(name: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Aktuelle Channels in DataService sind: ', this.DataService.channels);
        const channel = this.DataService.channels.find(channel => channel.name === name);
        resolve(channel ? channel.id : '');
      }, 800);
    });
  }

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
