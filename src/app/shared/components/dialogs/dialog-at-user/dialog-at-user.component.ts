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
import { User } from '../../../models/user.class';
import { UserChipComponent } from '../../user-chip/user-chip.component';
import { CommonModule } from '@angular/common';
import { InputAddUserComponent } from '../../input-add-user/input-add-user.component';
import { Channel } from '../../../models/channel.class';

@Component({
  selector: 'app-dialog-at-user',
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
  templateUrl: './dialog-at-user.component.html',
  styleUrl: './dialog-at-user.component.scss'
})
export class DialogAtUserComponent {

  @ViewChild('userInp') userInp?: ElementRef;

  selectedUsers: User[] = []; // Neu

  constructor(
    public dialogRef: MatDialogRef<DialogAtUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentMemberIDs: string[], channel: Channel },
  ) { }


  /**
   * Closes the dialog without sending any response.
   * Typically used when the user closes the dialog without making a selection.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Closes the dialog with the selected users as the response.
   * @returns {void}
   */
  addUsers(): void {
    if (this.selectedUsers.length == 0) return
    this.dialogRef.close(this.selectedUsers);
  }


  /**
   * Determines the CSS classes to be applied based on the selected users.
   * @returns {Object} An object containing CSS classes based on the selection state.
   */
  setBtnClass(): any {
    return {
      'btn-disable': this.selectedUsers.length == 0,
      'btn-enable': this.selectedUsers.length > 0
    };
  }


  /**
   * Adds a user to the selected users list.
   * @param {User} user - The user to be added.
   * @returns {void}
   */
  onUserAdded(user: User): void {
    if (!this.selectedUsers.find(u => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
  }



  /**
   * Removes a user from the selected users list.
   * @param {User} user - The user to be removed.
   * @returns {void}
   */
  onUserRemoved(user: User): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }


  /**
   * Updates the selected users list based on changes.
   * Typically used when the user selection changes.
   * @param {User[]} users - The updated list of selected users.
   * @returns {void}
   */
  onSelectedUsersChanged(users: User[]): void {
    this.selectedUsers = users;
  }

}
