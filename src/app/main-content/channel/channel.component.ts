import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderChannelComponent } from './header/header-channel/header-channel.component';
import { ChannelMsgComponent } from './chat/channel-msg/channel-msg.component';
import { DirectMessageComponent } from './header/direct-message/direct-message.component';
import { DirectMsgComponent } from './chat/direct-msg/direct-msg.component';
import { InputTextareaComponent } from '../../shared/components/input-textarea/input-textarea.component';
import { User } from '../../shared/models/user.class';
import { Channel } from '../../shared/models/channel.class';


@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    MatCardModule,
    HeaderChannelComponent,
    ChannelMsgComponent,
    DirectMessageComponent,
    DirectMsgComponent,
    InputTextareaComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  chat: 'channel' | 'message' | 'new' = 'channel';


  // dummy Values
  user: User = {
    name: 'Frederik Beck (Du)',
    avatar: 1,
    email: '',
    status: '',
  }

  channel: Channel = {
    id: 'idTestChannel',
    name:'Office-team',
    description: 'Dieser Channel ist für alles rund um Office Infos vorgesehen. Hier kannst du zusammen mit deinem Team Meetings abhalten, Dokumente teilen und Entscheidungen treffen.',
    ownerID: 'abcde',
  }

}
