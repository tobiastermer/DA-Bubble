import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent,],
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
    public dialog: MatDialog
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

  logOut() {
    // const auth = getAuth();
    // signOut(auth)
    //   .then(() => {
    //     // Sign-out successful.
    //     console.log('ausgeloggt')
    //   })
    //   .catch((error) => {
    //     // An error happened.
    //   });

    this.presenceService.updateOnDisconnect();
    this.router.navigate(['login']);
    this.closeDialog();
  }
}
