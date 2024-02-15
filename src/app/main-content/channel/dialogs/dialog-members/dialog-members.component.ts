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
import { DialogShowUserComponent } from '../../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.members = data.members;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  openShowUserDialog() {
    this.dialog.open(DialogShowUserComponent,{
      panelClass: ['card-round-corners'],
      data: {},
    });
  }


  openAddUser(){
    this.dialogRef.close(true);
  }


}
