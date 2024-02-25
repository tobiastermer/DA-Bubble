import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';
import { PresenceService } from '../../../firebase-services/presence.service';

@Component({
  selector: 'app-dialog-show-user',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, FormsModule],
  templateUrl: './dialog-show-user.component.html',
  styleUrl: './dialog-show-user.component.scss'
})
export class DialogShowUserComponent {

  userStatusSubscription!: Subscription;
  userStatus: string = 'offline';
  currentUserID: string;

  constructor(
    public dialogRef: MatDialogRef<DialogShowUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialog: MatDialog,
    private PresenceService: PresenceService,
    private DataService: DataService,
  ) {
    this.currentUserID = this.DataService.currentUser.id!
  }

  ngOnInit() {
    if (this.data.user && this.data.user.uid) {
      this.userStatusSubscription = this.PresenceService.getUserStatus(this.data.user.uid).subscribe((status: string) => {
        this.userStatus = status;
      });
    }
  }

  ngOnDestroy() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }

  sendMessage() { }

  closeDialog() {
    this.dialogRef.close();
  }

  openDialogEditUser(user: User) {
    this.dialog.open(DialogEditUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }
}
