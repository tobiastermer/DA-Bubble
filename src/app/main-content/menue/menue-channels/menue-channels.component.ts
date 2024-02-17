import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Channel } from '../../../shared/models/channel.class';

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
  
  @Output() channelSelected = new EventEmitter<number>();
  
  // channels: string[] = ['Entwicklerteam', 'Office-Team', 'Plauderecke', 'Coffee-Corner'];
  channelsVisible: boolean = true;

  constructor() { }

  toggleChannelsVisibility() {
    this.channelsVisible = !this.channelsVisible;
  }

  setChannelActive(i: number) {
    this.channelSelected.emit(i);
  }

  isActiveChannel(i: number): boolean {
    return this.channelActive === i;
  }
}
