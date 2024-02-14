import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../models/user.class';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserChipComponent,
    CommonModule
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

  //dummy values for testing
  allUsers: User[] = [
    {
      name: 'Frederik Beck (Du)',
      avatar: 1,
      email: '',
      status: '',
    },
    {
      name: 'Sofia Müller',
      avatar: 2,
      email: '',
      status: '',
    },
    {
      name: 'Noah Braun',
      avatar: 3,
      email: '',
      status: '',
    },
    {
      name: 'Elise Roth',
      avatar: 4,
      email: '',
      status: '',
    },
    {
      name: 'Elias Neumann',
      avatar: 5,
      email: '',
      status: '',
    }
  ];

  userSelected = false;
  selectListVisible = false;
  filterdUsres!: User[];
  filterValues: string[] = [];
  addedUser!: User;


  @ViewChild('userInp') userInp?: ElementRef;


  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.setFilterValues();
  }


  setFilterValues() {
    this.allUsers.forEach(user => {
      this.filterValues.push(
        user.name.toLowerCase())
    });
  }


  filterUsers() {
    if (!this.userInp) return
    let serch = this.userInp.nativeElement.value;
    let index = this.searchUser(serch);
    if (index.length > 0 && serch.length > 0) this.fillFilterdUsres(index);
    else {
      this.filterdUsres = [];
      this.selectListVisible = false;
    }
  }


  searchUser(serch: string): number[] {
    let index = [];
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.filterValues[i].indexOf(serch.toLowerCase()) >= 0) {
        index.push(i)
      }
    }
    return index
  }


  fillFilterdUsres(index: number[]) {
    this.filterdUsres = [];
    index.forEach(index => {
      this.filterdUsres.push(this.allUsers[index])
    });
    this.selectListVisible = true;
  }


  closeFilterdUsers() {
    this.selectListVisible = false;
  }


  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  seletUser(user: User) {
    this.addedUser = user;
    this.userSelected = true;
    this.closeFilterdUsers();
  }


  removeUser() {
    this.userSelected = false;
    this.addedUser = new User;
  }


  addUser() {
    if (!this.userSelected) return
    this.dialogRef.close(this.addedUser)
  }


  setBtnClass() {
    return {
      'btn-disable': !this.userSelected,
      'btn-enable': this.userSelected
    }
  }
}
