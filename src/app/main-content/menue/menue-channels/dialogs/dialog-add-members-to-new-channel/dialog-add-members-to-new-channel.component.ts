import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Channel } from '../../../../../shared/models/channel.class';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { User } from '../../../../../shared/models/user.class';
import { InputAddUserComponent } from '../../../../../shared/components/input-add-user/input-add-user.component';
import { MembershipService } from '../../../../../shared/firebase-services/membership.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogErrorComponent } from '../../../../../shared/components/dialogs/dialog-error/dialog-error.component';
import { DataService } from '../../../../../shared/services/data.service';

/**
 * Dialog component for adding members to a new channel.
 */
@Component({
  selector: 'app-dialog-add-members-to-new-channel',
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
    MatFormFieldModule,
    MatProgressBarModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    InputAddUserComponent
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }],
  templateUrl: './dialog-add-members-to-new-channel.component.html',
  styleUrl: './dialog-add-members-to-new-channel.component.scss'
})
export class DialogAddMembersToNewChannelComponent {

  loading: boolean = false;
  users: User[] = [];
  radioSelection: string = '';
  userSelected = false;
  selectedUsers: User[] = [];
  addedUser!: User;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMembersToNewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newChannel: Channel, currentMemberIDs: string[] },
    public dialog: MatDialog,
    private MembershipService: MembershipService,
    private DataService: DataService,
  ) {
    this.DataService.users$.subscribe(users => {
      this.users = users;
    });
  }

  /**
 * Closes the dialog without any action.
 */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
 * Returns CSS classes for the submit button based on the ability to submit.
 * @returns An object with CSS class names as keys and boolean values.
 */
  setBtnClass(): any {
    return {
      'btn-disable': !this.canSubmit(),
      'btn-enable': this.canSubmit()
    };
  }

  /**
 * Handles the event when a user is added to the selection.
 * @param user The user that was added.
 */
  onUserAdded(user: User) {
    this.addedUser = user;
    this.userSelected = true;
  }

  /**
  * Handles the event when a user is removed from the selection.
  * @param user The user that was removed.
  */
  onUserRemoved(user: User) {
    this.userSelected = false;
  }

  /**
 * Updates the selected users based on changes in the selection.
 * @param users The array of selected users.
 */
  onSelectedUsersChanged(users: User[]) {
    this.selectedUsers = users;
    // Aktualisiere die Logik für den Submit-Button basierend auf `selectedUsers`
  }

  /**
  * Determines if the form can be submitted based on the current state.
  * @returns True if the form can be submitted, false otherwise.
  */
  canSubmit(): boolean {
    if (this.radioSelection === 'all') {
      return true;
    } else if (this.radioSelection === 'specific' && this.selectedUsers.length > 0) {
      return true;
    }
    return false;
  }

  /**
 * Saves the memberships for the selected users or all users based on the radio selection.
 */
  async saveMemberships() {
    this.loading = true;
    try {
      if (this.radioSelection === 'all') {
        for (let user of this.users) {
          if (!this.data.currentMemberIDs.includes(user.id!)) {
            const membership = this.MembershipService.createMembership(user.id!, this.data.newChannel.id);
            await this.MembershipService.addMembership(membership);
          }
        }
      } else if (this.radioSelection === 'specific' && this.userSelected) {
        for (const user of this.selectedUsers) {
          const membership = this.MembershipService.createMembership(user.id!, this.data.newChannel.id);
          await this.MembershipService.addMembership(membership);
        }
      }
    } catch (err) {
      console.error(err);
      this.loading = false;
      this.dialog.open(DialogErrorComponent, {
        panelClass: ['card-round-corners'],
        data: { errorMessage: 'Es gab ein Problem Hinzufügen von Mitgliedern. Bitte versuche es erneut.' }
      });
      return;
    }
    this.loading = false;
    this.dialogRef.close();
  }

}


