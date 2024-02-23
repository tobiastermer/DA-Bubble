import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { DataService } from '../../../shared/services/data.service';


@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.scss',
})
export class MenuDialogComponent {
  @Input() dropDown: boolean = false;

  constructor(public dialogRef: MatDialogRef<MenuDialogComponent>, public data: DataService) {

    console.log(data.currentUser)
  }
}
