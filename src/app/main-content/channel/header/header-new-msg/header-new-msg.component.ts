import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { User } from '../../../../shared/models/user.class';
import { Channel } from '../../../../shared/models/channel.class';


@Component({
  selector: 'app-header-new-msg',
  standalone: true,
  imports: [
    UserChipComponent,
  ],
  templateUrl: './header-new-msg.component.html',
  styleUrl: './header-new-msg.component.scss'
})
export class HeaderNewMsgComponent {

  userSelected = false;
  selectListVisible = false;
  filterdUsers!: User[];
  filterValues: string[] = [];
  allUsers: User[]= [];


  @ViewChild('inp') inp?: ElementRef;


  filterUsers() {
    if (!this.inp) return
    let serch = this.inp.nativeElement.value;
    let index = this.searchUser(serch);
    if (index.length > 0 && serch.length > 0) this.fillFilterdUsers(index);
    else {
      this.filterdUsers = [];
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


  fillFilterdUsers(index: number[]) {
    this.filterdUsers = [];
    index.forEach(index => {
      this.filterdUsers.push(this.allUsers[index])
    });
    this.selectListVisible = true;
  }

}
