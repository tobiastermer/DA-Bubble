import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { slideAnimation } from '../../shared/services/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  animations: [slideAnimation],
})
export class PrivacyPolicyComponent {
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