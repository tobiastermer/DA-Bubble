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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../../shared/models/user.class';
import { DialogsService } from '../../../../shared/services/dialogs.service';

@Component({
  selector: 'app-dialog-members',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserChipComponent,
  ],
  templateUrl: './dialog-members.component.html',
  styleUrl: './dialog-members.component.scss'
})
export class DialogMembersComponent {

  members: User[]

  constructor(
    public dialogRef: MatDialogRef<DialogMembersComponent>,
    public dialog: MatDialog,
    public dialogService: DialogsService,
    @Inject(MAT_DIALOG_DATA) public data: { members: User[] },
  ) {
    this.members = data.members;
  }


  /**
   * Closes the current dialog without taking any further action.
   * @returns {void}
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  // /**
  //  * Opens a dialog to show detailed information about the specified user.
  //  * @param {User} user - The user whose information will be displayed in the dialog.
  //  * @returns {void}
  //  */
  // openShowUserDialog(user: User): void {
  //   this.dialog.open(DialogShowUserComponent, {
  //     panelClass: ['card-round-corners'],
  //     data: { user },
  //   });
  // }


  /**
   * Closes the current dialog and indicates that the user should be added.
   * @returns {void}
   */
  openAddUser(): void {
    this.dialogRef.close(true);
  }

}
