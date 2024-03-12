import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../shared/models/user.class';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';
import { PositionService } from '../../../shared/services/position.service';

/**
 * Component for displaying and managing user messages in the menu.
 */
@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenueMessagesComponent, UserChipComponent],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent implements OnDestroy {
  @Input() pathUserName: string = '';

  @Output() activeChannelChanged = new EventEmitter<number>();
  @Output() userSelected = new EventEmitter<number>();

  pathChat: string = '';
  pathContentName: string = '';
  users: User[] = [];
  usersVisible: boolean = true;

  private usersSubscription: Subscription;

  constructor(
    private DataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private positionService: PositionService,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.pathChat = params['chat'];
      this.pathContentName = params['idChat'];
    });


    this.usersSubscription = this.DataService.users$.subscribe(users => {
      this.users = users;
    });
  }

  /**
   * Cleans up the component by unsubscribing from user data.
   */
  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  /**
     * Toggles the visibility of the user list.
     */
  toggleUsersVisibility() {
    this.usersVisible = !this.usersVisible;
  }

  /**
    * Changes the router path to the selected user for messaging.
    * @param {number} activeUserIndex - The index of the selected user.
    */
  changePath(activeUserIndex: number) {
    this.positionService.setActiveResponsiveWindow('channel');
    let name = this.users[activeUserIndex].name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
  }

  /**
   * Determines if a user is the active user based on the current route.
   * @param {number} i - The index of the user to check.
   * @returns {boolean} True if the user is the active user, false otherwise.
   */
  isActiveUser(i: number): boolean {
    return this.pathChat == "message" && this.pathContentName == this.users[i].name.replace(/\s/g, '_');
  }

}
