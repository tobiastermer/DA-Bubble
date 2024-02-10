import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenueChannelsComponent } from './menue-channels/menue-channels.component';
import { MenueMessagesComponent } from './menue-messages/menue-messages.component';
import { MenueHeaderComponent } from './menue-header/menue-header.component';

@Component({
  selector: 'app-menue',
  standalone: true,
  imports: [MatCardModule,
            MenueHeaderComponent,
            MenueChannelsComponent,
            MenueMessagesComponent],
  templateUrl: './menue.component.html',
  styleUrl: './menue.component.scss'
})
export class MenueComponent {

}
