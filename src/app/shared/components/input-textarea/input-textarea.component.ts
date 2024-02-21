import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChannelMessage } from '../../models/channel-message.class';
import { DataService } from '../../services/data.service';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { Channel } from '../../models/channel.class';


@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {

  @Input() channel!: Channel;
  @Input() msg!: ChannelMessage;

  @ViewChild('messageText') messageText!: ElementRef;

  isButtonDisabled: boolean = true;

  constructor(private data: DataService, private messageFBS: ChannelMessagesService) { }

  updateButtonState(textValue: string): void {
    this.isButtonDisabled = !textValue.trim();
  }

  /////// INPUT FORM EVENTLISTENDER FOR KEYBOARD ENTER + SHIFT/ENTER///////
  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) {
    } else {
      event.preventDefault();
      if (textValue.trim()) {
        this.addNewMsg(textValue.trim());
        if (this.messageText) {
          this.messageText.nativeElement.value = '';
        }
      }
    }
  }

  async addNewMsg(text: string) {
    let newMsg: ChannelMessage | undefined = this.fillMessage(text)
    if (!newMsg) return
    else {
      let id = await this.messageFBS.addChannelMessage(newMsg);
    }
  }

  fillMessage(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel.id || this.channel.id === '') return
    let msg = new ChannelMessage();
    msg.date = new Date().getTime();
    msg.channelID = this.channel.id;
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text;
    return msg
  }


}
