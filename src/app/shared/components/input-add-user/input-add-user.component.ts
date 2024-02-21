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
  @Output() userAdded = new EventEmitter<User>();
  @Output() userRemoved = new EventEmitter<void>();
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  userSelected: boolean = false;
  selectListVisible: boolean = false;
  filteredUsers: User[] = [];
  addedUser!: User;

  ngOnInit() {
    // Initialisiert die gefilterten Benutzer mit allen Benutzern
    this.filteredUsers = [...this.allUsers];
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  filterUsers() {
    const search = this.userInput.nativeElement.value.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user => user.name.toLowerCase().includes(search));
    this.selectListVisible = !!search && this.filteredUsers.length > 0;
  }

  selectUser(user: User) {
    this.addedUser = user;
    this.userSelected = true;
    this.selectListVisible = false;
    this.userAdded.emit(this.addedUser);
  }

  removeUser() {
    this.userSelected = false;
    this.addedUser = new User;
    this.userRemoved.emit();
  }

  trackByFn(index: number, item: User): any {
    return item.id; // oder einen anderen eindeutigen Wert
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.selectListVisible = false;
  }
}