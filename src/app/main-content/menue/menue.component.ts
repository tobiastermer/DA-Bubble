import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenueChannelsComponent } from './menue-channels/menue-channels.component';
import { MenueMessagesComponent } from './menue-messages/menue-messages.component';
import { MenueHeaderComponent } from './menue-header/menue-header.component';
import { User } from '../../shared/models/user.class';

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
  @Input() users: User[] = [];

  isMenuOpen: boolean = true;
  isHovering: boolean = false; // Neue Variable für Hover-Zustand
  activeChannel: number | undefined;
  activeUser: number | undefined;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Methoden zum Ändern des Hover-Zustands des Close-Overlays
  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  getIconSource(): string {
    if (this.isMenuOpen) {
      return this.isHovering ? "../../../assets/img/icons/close_menu_bl.png" : "../../../assets/img/icons/close_menu_bk.png";
    } else {
      return this.isHovering ? "../../../assets/img/icons/open_menu_bl.png" : "../../../assets/img/icons/open_menu_bk.png";
    }
  }

  // Methoden zum Switchen zwischen aktiver Nachricht oder aktivem CHannel
  setActiveChannel(index: number | undefined) {
    this.activeChannel = index;
    this.activeUser = undefined;
  }

  setActiveMessage(index: number | undefined) {
    this.activeUser = index;
    this.activeChannel = undefined;
  }
  
}
