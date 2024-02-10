import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-menue-channels',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './menue-channels.component.html',
  styleUrl: './menue-channels.component.scss'
})
export class MenueChannelsComponent {

  channels: string[] = ['Entwicklerteam', 'Office-Team', 'Plauderecke', 'Coffee-Corner'];
}
