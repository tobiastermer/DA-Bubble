import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { UserService } from '../../../firebase-services/user.service';
import { verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { DataService } from '../../../services/data.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
  ],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss',
})
export class DialogEditUserComponent {
  newName: string;
  newEmail: string;
  userNameError: string = '';
  userEmailError: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialog: MatDialog,
    private UserService: UserService,
    private cdr: ChangeDetectorRef,
    private auth: Auth
  ) {
    this.newName = this.data.user.name;
    this.newEmail = this.data.user.email;
  }


  /**
   * Validates the input user name and updates the error message accordingly.
   * Triggers manual change detection.
   * @returns {void}
   */
  validateInputUserName(): void {
    this.userNameError = this.UserService.validateInputUserName(
      this.newName,
      this.data.user.name || ''
    );
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }


  /**
   * Validates the input user email and updates the error message accordingly.
   * Triggers manual change detection.
   * @returns {void}
   */
  validateInputUserEmail(): void {
    this.userEmailError = this.UserService.validateInputUserEmail(
      this.newEmail,
      this.data.user.email || ''
    );
    this.cdr.detectChanges(); // Manuelle Auslösung der Änderungserkennung
  }


  /**
   * Checks if the user information is valid for saving.
   * @returns {boolean} True if the user information is valid; otherwise, false.
   */
  canSaveUser(): boolean {
    return (
      !this.userNameError &&
      !this.userEmailError &&
      this.newName.length > 0 &&
      this.newEmail.length > 0
    );
  }


  /**
   * Saves the updated user information.
   * @returns {void}
   */
  async saveUser(): Promise<void> {
    const user = this.data.user;
    user.name = this.newName;
    if (this.canSaveUser()) {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        try {
          await verifyBeforeUpdateEmail(currentUser, this.newEmail);
          if (user.email !== this.newEmail) this.openErrorDialog('Deine neue Email-Adresse wird erst wirksam, sobald du die Änderung bestätigt hast. Schaue gleich in deinem E-Mail-Postfach nach und bestätige die Änderung mit Klick auf den Link.')
        } catch (error) {
          console.error(error);
        }
      }
    }
    this.dialogRef.close(user);
  }


  /**
   * Opens a dialog to display an error message.
   * @param {string} errorMsg - The error message to be displayed.
   * @returns {void}
   */
  openErrorDialog(errorMsg: string): void {
    this.dialog.open(DialogErrorComponent, {
      panelClass: ['card-round-corners'],
      data: { errorMessage: errorMsg }
    });
  }

  /**
   * Closes the dialog.
   * @returns {void}
   */
  closeDialog(): void {
    this.dialogRef.close();
  }


  /**
   * Closes the dialog.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Sets a fallback image in case the user avatar image fails to load.
   * @param {Event} event - The image load error event.
   * @returns {void}
   */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      '../../assets/img/avatars/unknown.jpg';
  }
}
