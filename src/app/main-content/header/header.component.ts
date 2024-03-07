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
import { slideInRightAnimationSlow, slideInleftAnimationSlow } from '../../shared/services/animations';
import { PositionService } from '../../shared/services/position.service';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatDialogModule, MatCardModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    slideInRightAnimationSlow,
    slideInleftAnimationSlow
    
  ],
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
  isMenuVisible: Boolean = true;

  constructor(
    public dialog: MatDialog,
    private DataService: DataService,
    private positionService: PositionService,
  ) {
    this.currentUser = this.DataService.currentUser!;

  }

  ngOnInit() {
    this.positionService.isResponsiveWindowVisible('menu').subscribe(isVisible => {
      this.isMenuVisible = isVisible;
    });
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

  goToMenu() {
    this.positionService.setActiveResponsiveWindow('menu');
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = './../../assets/img/avatars/unknown.jpg';
  }

}
