import { Component, EventEmitter, Output, ViewChild, HostListener, ElementRef, Input, OnDestroy } from '@angular/core';
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
    private dataService: DataService,
  ) {
    this.usersSubscription = this.dataService.users$.subscribe(users => {
      this.users = users;
    });
  }


  /**
   * Unsubscribes from the users subscription to prevent memory leaks.
   */
  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }


  /**
   * Stops the propagation of the provided mouse event.
   * @param {MouseEvent} event - The mouse event to stop propagation for.
   */
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }


  /**
   * Filters users based on the input value in the user input field.
   */
  filterUsers() {
    const search = this.userInput.nativeElement.value.toLowerCase();
    if (this.searchAllUsers) this.filteredUsers = this.filterInUsers(search);
    else this.filteredUsers = this.filterMembers(search)
    this.selectListVisible = !!search && this.filteredUsers.length > 0;
  }


  /**
   * Filters users in the list of all users.
   * @param {string} search - The search query.
   * @returns {User[]} - The filtered list of users.
   */
  filterInUsers(search: string): User[] {
    let users = this.users.filter(user =>
      user.name &&
      user.name.toLowerCase().includes(search) &&
      !this.currentMemberIDs.includes(user.id!) &&
      !this.selectedUsers.map(u => u.id).includes(user.id)
    );
    return users
  }


  /**
   * Filters members of the current group or channel.
   * @param {string} search - The search query.
   * @returns {User[]} - The filtered list of members.
   */
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


  /**
   * Selects a user and emits the userAdded event.
   * @param {User} user - The user to be selected.
   */
  selectUser(user: User) {
    this.selectedUsers.push(user);
    this.userAdded.emit(user);
    this.userInput.nativeElement.value = '';
    this.filterUsers();
    this.selectedUsersChanged.emit(this.selectedUsers);
  }


  /**
   * Removes a user from the selected users list and emits the userRemoved event.
   * @param {User} user - The user to be removed.
   */
  removeUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
    this.userRemoved.emit(user);
    this.filterUsers();
    this.selectedUsersChanged.emit(this.selectedUsers);
  }


  /**
   * TrackBy function for ngFor to improve rendering performance.
   * @param {number} index - The index of the current item.
   * @param {User} item - The current user item.
   * @returns {any} - The unique identifier for the item.
   */
  trackByFn(index: number, item: User): any {
    return item.id;
  }


  /**
   * Listens for click events on the document and closes the user selection list if clicked outside.
   * @param {MouseEvent} event - The mouse event.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.selectListVisible = false;
  }

}