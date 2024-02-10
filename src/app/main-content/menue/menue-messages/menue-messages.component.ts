import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent {
  users = [
    {
      firstName: 'Frederik',
      lastName: 'Beck (Du)',
      avatar: 1
    },
    {
      firstName: 'Sofia',
      lastName: 'Müller',
      avatar: 2
    },
    {
      firstName: 'Noah',
      lastName: 'Braun',
      avatar: 3
    },
    {
      firstName: 'Elise',
      lastName: 'Roth',
      avatar: 4
    },
    {
      firstName: 'Elias',
      lastName: 'Neumann',
      avatar: 5
    }
  ];
  usersVisible: boolean = true;

  constructor() { }

  toggleUsersVisibility() {
    if (this.usersVisible) {
      this.usersVisible = false;
    } else {
      this.usersVisible = true;
    }
    console.log(this.usersVisible);
  }
}
