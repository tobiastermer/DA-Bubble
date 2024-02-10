import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-menue-header',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './menue-header.component.html',
  styleUrl: './menue-header.component.scss'
})
export class MenueHeaderComponent {

}
