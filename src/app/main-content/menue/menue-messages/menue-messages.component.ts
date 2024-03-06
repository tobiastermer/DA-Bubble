import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../shared/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogShowUserComponent } from '../../../shared/components/dialogs/dialog-show-user/dialog-show-user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menue-messages',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenueMessagesComponent, UserChipComponent],
  templateUrl: './menue-messages.component.html',
  styleUrl: './menue-messages.component.scss'
})
export class MenueMessagesComponent implements OnDestroy {
  @Input() pathUserName: string = '';

  @Output() activeChannelChanged = new EventEmitter<number>();
  @Output() userSelected = new EventEmitter<number>();

  pathChat: string = '';
  pathContentName: string = '';
  users: User[] = [];
  usersVisible: boolean = true;

  private usersSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private DataService: DataService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.params.subscribe(params => {
      this.pathChat = params['chat'];
      this.pathContentName = params['idChat'];
    });

    
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
    let name = this.users[activeUserIndex].name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
  }


  isActiveUser(i: number): boolean {
    return this.pathChat == "message" && this.pathContentName == this.users[i].name.replace(/\s/g, '_');
  }

  
  openDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user },
    });
  }

}
