import { Component, Inject, Input, OnInit } from '@angular/core';
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

  defaultAvatar: string = '../../../../../assets/img/avatars/unknown.jpg';

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

    // Methode zum Setzen des Ersatzbildes
    onImageError(event: Event) {
      (event.target as HTMLImageElement).src = '../../../../../assets/img/avatars/unknown.jpg';
    }

}
