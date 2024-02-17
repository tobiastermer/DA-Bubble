import { Component, Inject, Input } from '@angular/core';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { DialogShowUserComponent } from '../../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from '../../../../shared/models/user.class';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [
    UserChipComponent
  ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {

  @Input() user!: User;

  constructor(
    public dialog: MatDialog,
  ) { }


  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent,{
      panelClass: ['card-round-corners'],
      data: {user},
    });
  }

}
