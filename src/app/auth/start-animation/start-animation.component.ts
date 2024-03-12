import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';


@Component({
  selector: 'app-start-animation',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './start-animation.component.html',
  styleUrl: './start-animation.component.scss'
})
export class StartAnimationComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2500); 
  }
}
