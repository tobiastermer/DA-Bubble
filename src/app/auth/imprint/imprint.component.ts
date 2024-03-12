import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { slideAnimation, slideInUpAnimation, slideOutDownAnimation } from '../../shared/services/animations';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
  animations: [slideAnimation],
})

export class ImprintComponent {
  animationState = 'in';

  constructor(
private router: Router
    
  ){}

  openLogin() {
    this.animationState = 'out';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 850);
  }
}
