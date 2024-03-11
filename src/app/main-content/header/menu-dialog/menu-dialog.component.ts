import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { User } from '../../../shared/models/user.class';
import { PresenceService } from '../../../shared/firebase-services/presence.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogsService } from '../../../shared/services/dialogs.service';

/**
 * Represents the menu dialog component.
 */
@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss',
})
export class MenuDialogComponent {
  @Input() dropDown: boolean = false;

   /**
   * Initializes a new instance of the MenuDialogComponent class.
   * @param dialogRef Reference to the dialog opened.
   * @param data Service for data operations.
   * @param router Service to navigate among views.
   * @param dialogService Service to manage dialog components.
   * @param presenceService Service to manage user presence.
   * @param platformId Identifier for the platform being used.
   */
  constructor(
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public data: DataService,
    private router: Router,
    private dialogService: DialogsService,
    public presenceService: PresenceService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

   /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialogRef.close();
  }

   /**
   * Opens a dialog to show user details.
   * @param user The user whose details to show.
   * @param currentUserID The ID of the current user.
   */
  openDialog(user: User, currentUserID: String | undefined) {
    this.dialogService.showUserDialog(user, currentUserID);
    this.closeDialog();
  }

  /**
   * Logs out the current user, updates their presence status to offline, and navigates to the login page.
   */
  async logOut() {
    this.presenceService.updateOnDisconnect().then(() => {
      this.presenceService.updateGuestStatus("t8WOIhqo9BYogI9FmZhtCHP7K3t1", 'offline');
      this.presenceService.stopTracking();

      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('currentUser');
      }

      this.router.navigate(['login']);
      this.closeDialog();
    }).catch((error) => {
      console.error("Fehler beim Setzen des Offline-Status", error);
    });
    this.presenceService.updateGuestStatus("t8WOIhqo9BYogI9FmZhtCHP7K3t1", 'offline');
  }
}
