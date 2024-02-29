import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenueChannelsComponent } from './menue-channels/menue-channels.component';
import { MenueMessagesComponent } from './menue-messages/menue-messages.component';
import { MenueHeaderComponent } from './menue-header/menue-header.component';
import { User } from '../../shared/models/user.class';
import { Membership } from '../../shared/models/membership.class';
import { Channel } from '../../shared/models/channel.class';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PositionService } from '../../shared/services/position.service';

@Component({
  selector: 'app-menue',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MenueHeaderComponent,
    MenueChannelsComponent,
    MenueMessagesComponent],
  templateUrl: './menue.component.html',
  styleUrl: './menue.component.scss'
})
export class MenueComponent {
  @Input() users: User[] = [];
  @Input() currentUserID: string = '';
  @Input() currentUserChannelIDs: string[] = [];
  @Input() channels: Channel[] = [];

  isMenuOpen: boolean = true;
  isHovering: boolean = false;
  hideMenu: boolean = false;
  activeChannel: number | undefined;
  activeUser: number | undefined;
  pathUserName: string = '';
  pathChat: string = '';
  pathContentID: string = '';
  filteredChannels: Channel[] = [];

  menuOpen: boolean = true; // Standardwert

  constructor(
    private router: ActivatedRoute,
    private positionService: PositionService) {
    this.router.params.subscribe(params => {
      this.pathUserName = params['idUser'];
      this.pathChat = params['chat'];
      this.pathContentID = params['idChat'];
    })
  }

  ngOnInit() {
    this.filterChannelsBasedOnCurrentUser();

    this.positionService.isMenuOpen().subscribe(open => {
      this.menuOpen = open;
    });
  }

  filterChannelsBasedOnCurrentUser() {
    // Filtert die Channels basierend auf den currentUserChannelIDs
    this.filteredChannels = this.channels.filter(channel => this.currentUserChannelIDs.includes(channel.id));
  }

  // toggleMenu() {
  //   // this.isMenuOpen = !this.isMenuOpen;

  //   // open
  //   if (this.isMenuOpen) {
  //     this.isMenuOpen = false;
  //     setTimeout(() => {
  //       this.hideMenu = true;
  //     }, 500);
  //     // closed
  //   } else {
  //     this.hideMenu = false;
  //     setTimeout(() => {
  //       this.isMenuOpen = true
  //     }, 100);
  //   }
  // }

  toggleMenu() {
    this.positionService.toggleMenu();
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
