import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menue-header',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './menue-header.component.html',
  styleUrl: './menue-header.component.scss'
})
export class MenueHeaderComponent {

  @Input() pathUserName: string = '';


  constructor(private router: Router) { }

  changePath() {
    this.router.navigate([this.pathUserName + '/new/message/']);
  }
}
