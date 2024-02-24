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
  radioSelection: string = '';
  userSelected = false;
  selectedUsers: User[] = [];
  addedUser!: User;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMembersToNewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newChannel: Channel, allUsers: User[], currentMemberIDs: string[] },
    public dialog: MatDialog,
    private MembershipService: MembershipService
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setBtnClass(): any {
    return {
      'btn-disable': !this.canSubmit(),
      'btn-enable': this.canSubmit()
    };
  }

  onUserAdded(user: User) {
    this.addedUser = user;
    this.userSelected = true;
  }

  onUserRemoved(user: User) {
    this.userSelected = false;
  }

  onSelectedUsersChanged(users: User[]) {
    this.selectedUsers = users;
    // Aktualisiere die Logik für den Submit-Button basierend auf `selectedUsers`
  }

  canSubmit(): boolean {
    if (this.radioSelection === 'all') {
      return true;
    } else if (this.radioSelection === 'specific' && this.selectedUsers.length > 0) {
      return true;
    }
    return false;
  }

  async saveMemberships() {
    this.loading = true;
    try {
      if (this.radioSelection === 'all') {
        for (let user of this.data.allUsers) {
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


