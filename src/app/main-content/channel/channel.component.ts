import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderChannelComponent } from './header/header-channel/header-channel.component';
import { InputTextareaComponent } from '../../shared/components/input-textarea/input-textarea.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatCardModule,
    HeaderChannelComponent,
    InputTextareaComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

}
