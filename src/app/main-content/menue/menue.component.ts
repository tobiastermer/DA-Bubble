import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenueChannelsComponent } from './menue-channels/menue-channels.component';
import { MenueMessagesComponent } from './menue-messages/menue-messages.component';
import { MenueHeaderComponent } from './menue-header/menue-header.component';
import { User } from '../../shared/models/user.class';
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
      this.isMenuOpen = open;
    });
  }

  filterChannelsBasedOnCurrentUser() {
    this.filteredChannels = this.channels.filter(channel => this.currentUserChannelIDs.includes(channel.id));
  }

  toggleMenu() {
    this.positionService.toggleMenu();
  }

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

}
