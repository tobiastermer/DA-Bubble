import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenueChannelsComponent } from './menue-channels/menue-channels.component';
import { MenueMessagesComponent } from './menue-messages/menue-messages.component';
import { MenueHeaderComponent } from './menue-header/menue-header.component';
import { User } from '../../shared/models/user.class';
import { Channel } from '../../shared/models/channel.class';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../../shared/services/position.service';

/**
 * Component for displaying the menu including channels, messages, and user information.
 */
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
  users: User[] = [];
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
    private route: ActivatedRoute,
    private router: Router,
    private positionService: PositionService) {
    this.route.params.subscribe(params => {
      this.pathUserName = params['idUser'];
      this.pathChat = params['chat'];
      this.pathContentID = params['idChat'];
    })
  }

  /**
  * OnInit lifecycle hook to filter channels based on the current user and subscribe to menu open state.
  */
  ngOnInit() {
    this.filterChannelsBasedOnCurrentUser();

    this.positionService.isMenuOpen().subscribe(open => {
      this.isMenuOpen = open;
    });
  }

  /**
  * Filters channels based on the current user's channel IDs.
  */
  filterChannelsBasedOnCurrentUser() {
    this.filteredChannels = this.channels.filter(channel => this.currentUserChannelIDs.includes(channel.id));
  }

  /**
  * Toggles the visibility of the menu.
  */
  toggleMenu() {
    this.positionService.toggleMenu();
  }

  /**
   * Sets the hovering state to true when the mouse enters the menu toggle area.
   */
  onMouseEnter() {
    this.isHovering = true;
  }

  /**
   * Resets the hovering state to false when the mouse leaves the menu toggle area.
   */
  onMouseLeave() {
    this.isHovering = false;
  }

  /**
  * Determines the source of the menu icon based on the menu's open state and whether the mouse is hovering.
  * @returns {string} The path to the appropriate icon image.
  */
  getIconSource(): string {
    if (this.isMenuOpen) {
      return this.isHovering ? "../../../assets/img/icons/close_menu_bl.png" : "../../../assets/img/icons/close_menu_bk.png";
    } else {
      return this.isHovering ? "../../../assets/img/icons/open_menu_bl.png" : "../../../assets/img/icons/open_menu_bk.png";
    }
  }

  /**
   * Changes the path to the new message creation page.
   */
  changePath() {
    this.positionService.setActiveResponsiveWindow('channel');
    this.router.navigate([this.pathUserName + '/new/message/']);
  }

}
