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
import { UserService } from '../../../firebase-services/user.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-show-user',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, FormsModule, MatProgressBarModule],
  templateUrl: './dialog-show-user.component.html',
  styleUrl: './dialog-show-user.component.scss'
})
export class DialogShowUserComponent {

  userStatusSubscription!: Subscription;
  userStatus: string = 'offline';
  currentUser: User;
  currentUserID: string;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogShowUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialog: MatDialog,
    private PresenceService: PresenceService,
    private DataService: DataService,
    private UserService: UserService,
    private router: Router) {
    this.currentUserID = this.DataService.currentUser.id!;
    this.currentUser = this.DataService.currentUser;
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

  sendMessage(user: User) {
    let name = user.name.replace(/\s/g, '_');
    this.router.navigate(['/message/' + name]);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openDialogEditUser(user: User) {
    const userCopy = new User({ ...user });
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: userCopy },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveUser(result);
      }
    });
  }

  async saveUser(user: User) {
    this.loading = true;
    const nameHasChanged = this.nameHasChanged(user);
    const emailHasChanged = this.emailHasChanged(user);
    
    if (nameHasChanged || emailHasChanged) {
      try {
        await this.UserService.updateUser(user);
        this.currentUser = user;
        this.data.user = user;
        this.DataService.currentUser = user;
      } catch (error) {
        this.dialog.open(DialogErrorComponent, {
          panelClass: ['card-round-corners'],
          data: { errorMessage: 'Es gab ein Problem beim Ändern des Profils. Bitte versuche es erneut.' }
        });
      }
    } else {
      console.log('Keine Änderungen erkannt.');
    }
    this.loading = false;
  }


  nameHasChanged(updatedUser: User) {
    return this.data.user.name != updatedUser.name;
  }

  emailHasChanged(updatedUser: User) {
    return this.data.user.email != updatedUser.email;
  }

  sendConfirmationEmail() {

  }

  // Methode zum Setzen des Ersatzbildes
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '../../assets/img/avatars/unknown.jpg';
  }

}
