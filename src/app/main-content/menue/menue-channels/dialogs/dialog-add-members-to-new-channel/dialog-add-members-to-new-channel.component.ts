import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { Membership } from '../../../../../shared/models/membership.class';
import { MembershipService } from '../../../../../shared/firebase-services/membership.service';

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
  addedUser!: User;

  constructor(
    public dialogRef: MatDialogRef<DialogAddMembersToNewChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newChannel: Channel, allUsers: User[] },
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

  onUserRemoved() {
    this.userSelected = false;
  }

  canSubmit(): boolean {
    if (this.radioSelection === 'all') {
      return true;
    } else if (this.radioSelection === 'specific' && this.userSelected) {
      return true;
    }
    return false;
  }

  async saveMemberships() {
    this.loading = true;
    if (this.radioSelection === 'all') {
      for (let user of this.data.allUsers) {
        const membership = this.MembershipService.createMembership(user.id!, this.data.newChannel.id);
        await this.MembershipService.addMembership(membership).catch(err => console.error(err));
      }
    } else if (this.radioSelection === 'specific' && this.userSelected) {
      const membership = this.MembershipService.createMembership(this.addedUser.id!, this.data.newChannel.id);
      await this.MembershipService.addMembership(membership).catch(err => console.error(err));
    }
    this.loading = false;
    this.dialogRef.close();
  }

}


