import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { DataService } from '../../shared/services/data.service';
import { User } from '../../shared/models/user.class';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  dropDown: boolean = false;
  currentUser: User = new User({
    id: '',
    uid: '',
    email: 'Lädt...',
    name: 'Lädt...',
    avatar: './../../../assets/img/avatars/unknown.jpg'
  });

  constructor(
    public dialog: MatDialog,
    private DataService: DataService,
  ) {
    this.currentUser = this.DataService.currentUser!;

  }

  openDialog() {
    this.dialog.open(MenuDialogComponent, {
      panelClass: ['card-right-corner'],
      position: {
        top: '90px',
        right: '20px',
      },
    });
  }

  toggleDropDown() {
    if (this.dropDown) {
      this.dropDown = false;
    } else {
      this.dropDown = true;
    }
  }


}
