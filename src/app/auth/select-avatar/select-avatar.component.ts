import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule,MatIconModule,CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  avatars = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg'];
}
