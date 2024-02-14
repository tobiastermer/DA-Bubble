import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogShowUserComponent } from '../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';

@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenueMessagesComponent, UserChipComponent],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent {
  @Output() activeChannelChanged = new EventEmitter<number>();
  @Input() userActive: number | undefined;

  users: User[] = [
    {
      firstName: 'Frederik',
      lastName: 'Beck (Du)',
      avatar: 1,
      email: '',
      status:'',
    },
    {
      firstName: 'Sofia',
      lastName: 'Müller',
      avatar: 2,
      email: '',
      status:'',
    },
    {
      firstName: 'Noah',
      lastName: 'Braun',
      avatar: 3,
      email: '',
      status:'',
    },
    {
      firstName: 'Elise',
      lastName: 'Roth',
      avatar: 4,
      email: '',
      status:'',
    },
    {
      firstName: 'Elias',
      lastName: 'Neumann',
      avatar: 5,
      email: '',
      status:'',
    }
  ];
  usersVisible: boolean = true;
  user = new User();

  constructor(public dialog: MatDialog) {}

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



  openDialog() {
    this.dialog.open(DialogShowUserComponent,{
      panelClass: ['card-round-corners'],
      data: {},
    });
  }

}
