import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Channel } from '../../../shared/models/channel.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menue-channels',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './menue-channels.component.html',
  styleUrls: ['./menue-channels.component.scss'] // Achtung: Korrektur von styleUrl zu styleUrls
})
export class MenueChannelsComponent {
  @Input() channels: Channel[] = [];
  @Input() channelActive: number | undefined;
  @Input() pathUserName: string = '';

  @Output() channelSelected = new EventEmitter<number>();

  // channels: string[] = ['Entwicklerteam', 'Office-Team', 'Plauderecke', 'Coffee-Corner'];
  channelsVisible: boolean = true;

  constructor(private router: Router) { }

  toggleChannelsVisibility() {
    this.channelsVisible = !this.channelsVisible;
  }

  changePath(activeChannelIndex: number) {
    this.channelSelected.emit(activeChannelIndex);
    let name = this.channels[activeChannelIndex].name
    this.router.navigate([this.pathUserName + '/channel/' + name]);
  }

  isActiveChannel(i: number): boolean {
    return this.channelActive === i;
  }
}
