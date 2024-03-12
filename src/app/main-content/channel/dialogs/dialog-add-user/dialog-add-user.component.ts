import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../shared/models/user.class';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { CommonModule } from '@angular/common';
import { InputAddUserComponent } from '../../../../shared/components/input-add-user/input-add-user.component';
import { Channel } from '../../../../shared/models/channel.class';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserChipComponent,
    CommonModule,
    InputAddUserComponent
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

  @ViewChild('userInp') userInp?: ElementRef;

  selectedUsers: User[] = []; // Neu

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentMemberIDs: string[], channel: Channel },
  ) { }


  /**
   * Closes the current dialog without any further action.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Closes the current dialog and passes the selected users as the result.
   * If no users are selected, the dialog is closed without passing any result.
   * @returns {void}
   */
  addUsers(): void {
    if (this.selectedUsers.length == 0) return
    this.dialogRef.close(this.selectedUsers);
  }


  /**
   * Determines and returns the CSS classes for the button based on the number of selected users.
   * @returns {any} - An object containing CSS classes for the button.
   */
  setBtnClass(): any {
    return {
      'btn-disable': this.selectedUsers.length == 0,
      'btn-enable': this.selectedUsers.length > 0
    };
  }


  /**
   * Event handler for when a user is added.
   * Checks if the user is already selected, and if not, adds the user to the selected users list.
   * @param {User} user - The user being added.
   * @returns {void}
   */
  onUserAdded(user: User): void {
    if (!this.selectedUsers.find(u => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
  }

  /**
   * Event handler for when a user is removed.
   * Removes the specified user from the selected users list.
   * @param {User} user - The user being removed.
   * @returns {void}
   */
  onUserRemoved(user: User): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }


  /**
   * Event handler for when the selected users are changed.
   * Updates the list of selected users with the new list provided.
   * @param {User[]} users - The new list of selected users.
   * @returns {void}
   */
  onSelectedUsersChanged(users: User[]): void {
    this.selectedUsers = users;
  }

}
