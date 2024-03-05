import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialog,
} from '@angular/material/dialog';
import { DataService } from '../../../shared/services/data.service';

import { DialogShowUserComponent } from '../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { User } from '../../../shared/models/user.class';
import { getAuth, signOut } from 'firebase/auth';
import { PresenceService } from '../../../shared/firebase-services/presence.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss',
})
export class MenuDialogComponent {
  @Input() dropDown: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public data: DataService,
    private router: Router,
    public presenceService: PresenceService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  openDialog(user: User, currentUserID: String) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-right-corner'],
      position: {
        top: '90px',
        right: '20px',
      },
      data: { user, currentUserID },
    });
    this.closeDialog();
  }

  async logOut() {
    this.presenceService.updateOnDisconnect().then(() => {
      this.presenceService.updateGuestStatus("t8WOIhqo9BYogI9FmZhtCHP7K3t1", 'offline');
      this.presenceService.stopGuestTracking();
      
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
