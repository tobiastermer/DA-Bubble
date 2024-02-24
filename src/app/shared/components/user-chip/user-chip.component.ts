import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { PresenceService } from '../../firebase-services/presence.service'; 
import { Subscription } from 'rxjs';


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

  @Input() active:boolean = false;
  @Input() user!:User;
  @Input() smale = false;
  @Input() currentUserID: String = '';
  userStatusSubscription!: Subscription;
  userStatus: string = 'offline';

  constructor(private presenceService: PresenceService) {}

  @Output() deleteUser: EventEmitter<User> = new EventEmitter<User>();

  onUserChipDelet() {
    this.deleteUser.emit(this.user);
  }

  ngOnInit() {
    if (this.user && this.user.uid) {
      this.userStatusSubscription = this.presenceService.getUserStatus(this.user.uid).subscribe((status: string) => {
        this.userStatus = status;
      });
    }
  }

  ngOnDestroy() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }


}
