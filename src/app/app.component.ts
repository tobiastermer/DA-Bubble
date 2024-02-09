import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChannelComponent } from './main-content/channel/channel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChannelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DA-Bubble';
}
