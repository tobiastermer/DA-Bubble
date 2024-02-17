import { Component, Input } from '@angular/core';
import { User } from '../../../../shared/models/user.class';
import { DialogShowUserComponent } from '../../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-direct-msg',
  standalone: true,
  imports: [],
  templateUrl: './direct-msg.component.html',
  styleUrl: './direct-msg.component.scss'
})
export class DirectMsgComponent {

  @Input() user!: User;


  constructor(
    public dialog: MatDialog,
  ) { }


  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }

}
