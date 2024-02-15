import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../shared/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogShowUserComponent } from '../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { UserService } from '../../../shared/firebase-services/user.service';

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

  users: User[];

  // users: User[] = [
  //   {
  //     name: 'Frederik Beck (Du)',
  //     avatar: 1,
  //     email: '',
  //     status:'',
  //   },
  //   {
  //     name: 'Sofia Müller',
  //     avatar: 2,
  //     email: '',
  //     status:'',
  //   },
  //   {
  //     name: 'Noah Braun',
  //     avatar: 3,
  //     email: '',
  //     status:'',
  //   },
  //   {
  //     name: 'Elise Roth',
  //     avatar: 4,
  //     email: '',
  //     status:'',
  //   },
  //   {
  //     name: 'Elias Neumann',
  //     avatar: 5,
  //     email: '',
  //     status:'',
  //   }
  // ];
  usersVisible: boolean = true;
  user = new User();

  constructor(public dialog: MatDialog, private UserService: UserService) {
    this.users = this.getUsers();
    console.log(this.users);
  }

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

  getUsers(): User[] {
    return this.UserService.users;
  }

  openDialog(user: User) {
    this.dialog.open(DialogShowUserComponent,{
      panelClass: ['card-round-corners'],
      data: {user},
    });
    console.log(user);
  }

}
