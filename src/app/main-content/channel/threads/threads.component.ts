import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../../../shared/components/input-textarea/input-textarea.component';
import { ChannelMessage } from '../../../shared/models/channel-message.class';
import { Channel } from '../../../shared/models/channel.class';
import { MessageComponent } from '../../../shared/components/message/message.component';
import { DataService } from '../../../shared/services/data.service';





@Component({
  selector: 'app-threads',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    CommonModule,
    MatCardModule,
    MessageComponent,
    InputTextareaComponent,

  ],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
})
export class ThreadsComponent {
  // @ViewChild('messageText') messageText!: ElementRef;
  // isButtonDisabled: boolean = true;
  // responseCount = 0;

  // //////////// TEST AREA ///////////////


  // updateButtonState(textValue: string): void {
  //   this.isButtonDisabled = !textValue.trim();
  // }

  // /////// REPLY TO MESSAGE //////////
  // addMessage(text: string): void {
  //   const newReply: Message = {
  //     userFirstName: 'Aktueller Benutzer',
  //     text: text,
  //     timestamp: new Date().toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }),
  //   };

  //   this.messages[0].replies!.push(newReply);
  //   this.responseCount++;
  //   this.isButtonDisabled = true;
  // }

  // /////// INPUT FORM EVENTLISTENDER FOR KEYBOARD ///////
  // handleEnter(event: Event, textValue: string): void {
  //   const keyboardEvent = event as KeyboardEvent;
  //   if (keyboardEvent.shiftKey) {
  //   } else {
  //     event.preventDefault();
  //     if (textValue.trim()) {
  //       this.addMessage(textValue.trim());
  //       if (this.messageText) {
  //         this.messageText.nativeElement.value = '';
  //       }
  //     }
  //   }
  // } 



  @Input() channelMsg!: ChannelMessage | undefined;
  @Input() channel!: Channel | undefined;

  constructor(public data:DataService) { }

}
