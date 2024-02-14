import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

//TEST ARRAY /////
interface Message {
  userFirstName: string;
  text: string;
  timestamp: string;
  replies?: Message[];
}

@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {
  @ViewChild('messageText') messageText!: ElementRef;
  isButtonDisabled: boolean = true;

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
        this.addMessage(textValue.trim());
        if (this.messageText) {
          this.messageText.nativeElement.value = '';
        }
      }
    }
  }

  /////// REPLY TO MESSAGE //////////
  addMessage(text: string): void {
    const newReply: Message = {
      userFirstName: 'Aktueller Benutzer',
      text: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }
}
