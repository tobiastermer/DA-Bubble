import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MenueComponent } from './menue/menue.component';
import { ChannelComponent } from './channel/channel.component';
import { ThreadsComponent } from './threads/threads.component';
import { User } from '../shared/models/user.class';
import { UserService } from '../shared/firebase-services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderComponent, MenueComponent, ChannelComponent, ThreadsComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {
  users: User[] = [];
  private usersSubscription?: Subscription;

  constructor(private userService: UserService) {
    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.usersSubscription?.unsubscribe();
  }
}
