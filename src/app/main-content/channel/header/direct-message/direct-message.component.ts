import { Component, Input } from '@angular/core';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { DialogShowUserComponent } from '../../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { MatDialog } from '@angular/material/dialog';
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


  /**
   * Initializes the component.
   * If the user object is not provided, it creates a new User object with default loading values.
   * @returns {void}
   */
  ngOnInit(): void {
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


  /**
   * Opens a dialog to show detailed information about the specified user.
   * @param {User} user - The user whose information will be displayed in the dialog.
   * @returns {void}
   */
  openShowUserDialog(user: User): void {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }


  /**
   * Event handler for when an image fails to load.
   * Updates the source of the failed image to a default image.
   * @param {Event} event - The event triggered when the image fails to load.
   * @returns {void}
   */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '../../../../../assets/img/avatars/unknown.jpg';
  }

}
