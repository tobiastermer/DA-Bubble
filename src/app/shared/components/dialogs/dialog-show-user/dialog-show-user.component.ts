import { Component, Inject } from '@angular/core';
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


  /**
   * Initializes the component and subscribes to user status updates if the user data is available.
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.data.user && this.data.user.uid) {
      this.userStatusSubscription = this.PresenceService.getUserStatus(this.data.user.uid).subscribe((status: string) => {
        this.userStatus = status;
      });
    }
  }


  /**
   * Unsubscribes from user status updates when the component is destroyed.
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }


  /**
   * Navigates to the message page for the specified user.
   * @param {User} user - The user to send a message to.
   * @returns {void}
   */
  sendMessage(user: User): void {
    let name = user.name.replace(/\s/g, '_');
    this.router.navigate(['/message/' + name]);
  }


  /**
   * Closes the current dialog.
   * @returns {void}
   */
  closeDialog(): void {
    this.dialogRef.close();
  }


  /**
   * Opens a dialog to edit user information.
   * @param {User} user - The user to be edited.
   * @returns {void}
   */
  openDialogEditUser(user: User): void {
    const userCopy = new User({ ...user });
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: userCopy },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.saveUser(result);
    });
  }


  /**
   * Saves the updated user information.
   * @param {User} user - The updated user object.
   * @returns {Promise<void>}
   */
  async saveUser(user: User): Promise<void> {
    this.loading = true;
    const nameHasChanged = this.nameHasChanged(user);
    const emailHasChanged = this.emailHasChanged(user);
    if (nameHasChanged || emailHasChanged) {
      try {
        await this.updateUser(user)
      } catch (error) {
        this.openErrorDialog('Es gab ein Problem beim Ändern des Profils. Bitte versuche es erneut.')
      }
    }
    this.loading = false;
  }


  /**
   * Updates the user information.
   * @param {User} user - The updated user object.
   * @returns {Promise<void>}
   */
  async updateUser(user: User): Promise<void> {
    await this.UserService.updateUser(user);
    this.currentUser = user;
    this.data.user = user;
    this.DataService.currentUser = user;
  }


  /**
   * Opens an error dialog with the provided error message.
   * @param {string} errorInfo - The error message to display in the dialog.
   */
  openErrorDialog(errorInfo: string) {
    this.dialog.open(DialogErrorComponent, {
      panelClass: ['card-round-corners'],
      data: { errorMessage: errorInfo }
    });
  }


  /**
 * Checks if the name of the updated user has changed.
 * @param {User} updatedUser - The updated user object.
 * @returns {boolean} - True if the name has changed, otherwise false.
 */
  nameHasChanged(updatedUser: User): boolean {
    return this.data.user.name != updatedUser.name;
  }


  /**
   * Checks if the email of the updated user has changed.
   * @param {User} updatedUser - The updated user object.
   * @returns {boolean} - True if the email has changed, otherwise false.
   */
  emailHasChanged(updatedUser: User): boolean {
    return this.data.user.email != updatedUser.email;
  }


  sendConfirmationEmail() {

  }


  /**
   * Handles image loading errors by setting a fallback image source.
   * @param {Event} event - The image loading error event.
   */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '../../assets/img/avatars/unknown.jpg';
  }

}
