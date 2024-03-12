import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { StartAnimationComponent } from './auth/start-animation/start-animation.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SelectAvatarComponent } from './auth/select-avatar/select-avatar.component';
import { DataService } from './shared/services/data.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    MainContentComponent,
    SignUpComponent,
    StartAnimationComponent,
    SelectAvatarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DA-Bubble';

  constructor(private router: Router,private dataService: DataService) {
   
  }
  ngOnInit() {
    this.dataService.loadCurrentUser();
  }


 
}
