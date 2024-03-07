import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { PresenceService } from '../../firebase-services/presence.service';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-user-chip',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './user-chip.component.html',
  styleUrl: './user-chip.component.scss'
})
export class UserChipComponent implements OnInit, OnDestroy {

  @Input() active: boolean = false;
  @Input() user!: User;
  @Input() smale = false;

  userStatusSubscription!: Subscription;
  userStatus: string = 'offline';
  currentUserID: string;

  constructor(
    private presenceService: PresenceService,
    private DataService: DataService) {

    this.currentUserID = this.DataService.currentUser.id!;
  }

  @Output() deleteUser: EventEmitter<User> = new EventEmitter<User>();


  /**
   * Emits an event to delete the user chip.
   */
  onUserChipDelet() {
    this.deleteUser.emit(this.user);
  }


  /**
  * Initializes the component.
  */
  ngOnInit() {
    if (!this.user) {
      this.user = new User({
        id: '',
        uid: '',
        email: 'Lädt...',
        name: 'Lädt...',
        avatar: '../../../../../assets/img/avatars/unknown.jpg'
      });
    } else if (this.user && this.user.uid) {
      this.userStatusSubscription = this.presenceService.getUserStatus(this.user.uid).subscribe((status: string) => {
        this.userStatus = status;
      });
    }
  }


  /**
   * Cleans up resources before destroying the component.
   */
  ngOnDestroy() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }


  /**
   * Handles the event when an image fails to load, setting a default image.
   * @param {Event} event - The event triggered when the image fails to load.
   */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '../../../../assets/img/avatars/unknown.jpg';
  }

}
