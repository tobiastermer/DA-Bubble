import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { DataService } from '../../shared/services/data.service';
import { User } from '../../shared/models/user.class';
import { slideInRightAnimationSlow, slideInleftAnimationSlow } from '../../shared/services/animations';
import { PositionService } from '../../shared/services/position.service';
import { MatCardModule } from '@angular/material/card';
import { DialogsService } from '../../shared/services/dialogs.service';
import { Subscription } from 'rxjs';

/**
 * HeaderComponent manages the application's header, including user interactions and display.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatCardModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    slideInRightAnimationSlow,
    slideInleftAnimationSlow

  ],
})
export class HeaderComponent {
  dropDown: boolean = false;
  currentUser: User = new User({
    id: '',
    uid: '',
    email: 'Lädt...',
    name: 'Lädt...',
    avatar: './../../../assets/img/avatars/unknown.jpg'
  });
  isMenuVisible: Boolean = true;
  users: User[] = [];

  private usersSubscription!: Subscription;

  constructor(
    private DataService: DataService,
    private positionService: PositionService,
    private dialogService: DialogsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.currentUser = this.DataService.currentUser!;
  }

  /**
 * Initializes component, setting up subscriptions to observe changes in responsive window visibility.
 */
  ngOnInit() {
    this.positionService.isResponsiveWindowVisible('menu').subscribe(isVisible => {
      this.isMenuVisible = isVisible;
    });
  }

  /**
 * Subscribes to user data after the view initializes.
 */
  ngAfterViewInit() {
    this.usersSubscription = this.usersSubscriptionReturn();
  }

  /**
 * Subscribes to the DataService to receive updates on users, updating the current user if necessary.
 * @returns {Subscription} The subscription to the users data.
 */
  usersSubscriptionReturn() {
    return this.DataService.users$.subscribe((users) => {
      this.users = users;
      // Durchlaufe alle Benutzer und aktualisiere currentUser, wenn die IDs übereinstimmen
      const currentUserUpdate = users.find(user => user.id === this.currentUser.id);
      if (currentUserUpdate) {
        this.currentUser = currentUserUpdate;
      }
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  /**
 * Opens the header menu dialog.
 */
  openDialog() {
    this.dialogService.headerMenuDialog()
  }

  /**
 * Toggles the visibility of the dropdown menu.
 */
  toggleDropDown() {
    if (this.dropDown) {
      this.dropDown = false;
    } else {
      this.dropDown = true;
    }
  }

  /**
 * Navigates to the main menu, updating the responsive window state.
 */
  goToMenu() {
    this.positionService.setThreadResponsiveWindow(false);
    this.positionService.setActiveResponsiveWindow('menu');
  }

  /**
 * Handles image loading errors by setting a default avatar image.
 * @param {Event} event The event triggered by the image loading error.
 */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = './../../assets/img/avatars/unknown.jpg';
  }

  /**
 * Cleans up subscriptions when the component is destroyed.
 */
  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

}
