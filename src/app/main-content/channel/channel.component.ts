import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderChannelComponent } from './header/header-channel/header-channel.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatCardModule,
    HeaderChannelComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
