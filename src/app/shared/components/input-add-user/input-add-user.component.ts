import { Component, ChangeDetectorRef, EventEmitter, Output, ViewChild, HostListener, ElementRef, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { User } from '../../../shared/models/user.class';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-add-user',
  standalone: true,
  imports: [UserChipComponent,
    CommonModule],
  templateUrl: './input-add-user.component.html',
  styleUrl: './input-add-user.component.scss'
})

export class InputAddUserComponent implements OnDestroy {

  @Input() currentMemberIDs: string[] = [];
  @Input() FilterUsersMaxHeight: number = 250;
  @Input() searchAllUsers: boolean = true;

  @Output() userAdded = new EventEmitter<User>();
  @Output() userRemoved = new EventEmitter<User>();
  @Output() selectedUsersChanged = new EventEmitter<User[]>();

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  selectListVisible: boolean = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  private usersSubscription: Subscription;

  constructor(
    private DataService: DataService,
  ) {
    this.usersSubscription = this.DataService.users$.subscribe(users => {
      this.users = users;
    });
  }


  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }


  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }


  filterUsers() {
    const search = this.userInput.nativeElement.value.toLowerCase();
    if (this.searchAllUsers) this.filteredUsers = this.filterInUsers(search);
    else this.filteredUsers = this.filterMembers(search)
    this.selectListVisible = !!search && this.filteredUsers.length > 0;
  }


  filterInUsers(search: string): User[] {
    let users = this.users.filter(user =>
      user.name &&
      user.name.toLowerCase().includes(search) &&
      !this.currentMemberIDs.includes(user.id!) &&
      !this.selectedUsers.map(u => u.id).includes(user.id)
    );
    return users
  }


  filterMembers(search: string): User[] {
    let memberUsers: User[] = [];
    this.currentMemberIDs.forEach(id => {
      let users = this.users.filter(user => user.id == id);
      if (users.length > 0) memberUsers.push(users[0])
    });
    let users = memberUsers.filter(user =>
      user.name &&
      user.name.toLowerCase().includes(search) &&
      !this.selectedUsers.map(u => u.id).includes(user.id)
    );
    return users
  }


  selectUser(user: User) {
    this.selectedUsers.push(user);
    this.userAdded.emit(user);
    this.userInput.nativeElement.value = '';
    this.filterUsers();
    this.selectedUsersChanged.emit(this.selectedUsers);
  }


  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
    this.userRemoved.emit(user);
    this.filterUsers();
    this.selectedUsersChanged.emit(this.selectedUsers);
  }


  trackByFn(index: number, item: User): any {
    return item.id;
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.selectListVisible = false;
  }

}