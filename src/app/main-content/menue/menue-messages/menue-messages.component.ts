import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenueMessagesComponent],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent {
  @Output() activeChannelChanged = new EventEmitter<number>();
  @Input() userActive: number | undefined;

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
    this.usersVisible = !this.usersVisible;
  }

  @Output() userSelected = new EventEmitter<number>();

  setUserActive(i: number) {
    this.userSelected.emit(i); // Informiert die Parent-Komponente
  }

  isActiveUser(i: number): boolean {
    return this.userActive === i;
  }

}
