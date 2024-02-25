import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../shared/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogShowUserComponent } from '../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenueMessagesComponent, UserChipComponent],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent {
  @Input() userActive: number | undefined;
  @Input() pathUserName: string = '';

  @Output() activeChannelChanged = new EventEmitter<number>();
  @Output() userSelected = new EventEmitter<number>();

  private usersSubscription: Subscription = new Subscription();
  users: User[] = [];

  usersVisible: boolean = true;

  constructor(
    public dialog: MatDialog, 
    private DataService: DataService,
    private router: Router) {
  }

  ngOnInit() {
    this.usersSubscription = this.DataService.users$.subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  toggleUsersVisibility() {
    this.usersVisible = !this.usersVisible;
  }


  changePath(activeUserIndex: number) {
    this.userSelected.emit(activeUserIndex); // Informiert die Parent-Komponente
    let name = this.users[activeUserIndex].name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
  }

  isActiveUser(i: number): boolean {
    return this.userActive === i;
  }

  openDialog(user: User, currentUserID: String) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user, currentUserID },
    });
  }

}
