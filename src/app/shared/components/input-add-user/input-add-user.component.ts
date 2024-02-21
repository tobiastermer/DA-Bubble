import { Component, EventEmitter, Output, ViewChild, HostListener, ElementRef, Input, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.class';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-add-user',
  standalone: true,
  imports: [UserChipComponent,
    CommonModule],
  templateUrl: './input-add-user.component.html',
  styleUrl: './input-add-user.component.scss'
})

export class InputAddUserComponent implements OnInit {
  @Input() allUsers: User[] = [];
  @Input() currentMemberIDs: string[] = [];

  @Output() userAdded = new EventEmitter<User>();
  @Output() userRemoved = new EventEmitter<User>();
  @Output() selectedUsersChanged = new EventEmitter<User[]>();

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  selectListVisible: boolean = false;
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  ngOnInit() {
    // this.filterUsers();
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  filterUsers() {
    const search = this.userInput.nativeElement.value.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user =>
      user.name &&
      user.name.toLowerCase().includes(search) &&
      !this.currentMemberIDs.includes(user.id!) &&
      !this.selectedUsers.map(u => u.id).includes(user.id)
    );
    this.selectListVisible = !!search && this.filteredUsers.length > 0;
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