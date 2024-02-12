import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user.class';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-user-chip',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './user-chip.component.html',
  styleUrl: './user-chip.component.scss'
})
export class UserChipComponent {

  @Input() active:boolean = false;
  @Input() user!:User;
  @Input() smale = false;


}
