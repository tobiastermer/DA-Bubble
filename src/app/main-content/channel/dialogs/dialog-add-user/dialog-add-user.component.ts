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
    @Inject(MAT_DIALOG_DATA) public data: { allUsers: User[], currentMemberIDs: string[], channel: Channel },
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUsers() {
    if (this.selectedUsers.length == 0) return
    this.dialogRef.close(this.selectedUsers);
  }

  setBtnClass(): any {
    return {
      'btn-disable': this.selectedUsers.length == 0,
      'btn-enable': this.selectedUsers.length > 0
    };
  }

  onUserAdded(user: User) {
    if (!this.selectedUsers.find(u => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
  }

  onUserRemoved(user: User) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }

  onSelectedUsersChanged(users: User[]) {
    this.selectedUsers = users;
  }

}
