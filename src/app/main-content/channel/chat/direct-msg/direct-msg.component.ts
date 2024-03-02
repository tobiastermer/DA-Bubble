import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit() {
    if (!this.user) {
      this.user = new User({
        id: '',
        uid: '',
        email: 'Lädt...',
        name: 'Lädt...',
        avatar: '../../../../../assets/img/avatars/unknown.jpg'
      });
    }
  }

  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '../../../assets/img/avatars/unknown.jpg';
  }
}
