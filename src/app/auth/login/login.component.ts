import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';
import { Auth } from '@angular/fire/auth'; // wichtig @angular/fire/auth NICHT @fire/auth


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
  
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean = false;
  error = false; 
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private afAuth: Auth) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLoginSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(this.afAuth, email, password);
        console.log("User Credentials:", userCredential); // User Credentials ausloggen
        if (userCredential.user && userCredential.user.emailVerified) {
          console.log("Erfolgreich angemeldet und E-Mail ist verifiziert.");
          this.router.navigate(['/main']);
        } else {
          this.error = true;
          this.errorMessage = 'Bitte Account verifizieren.';
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      } catch (error) {
        this.error = true;
          this.errorMessage = 'Email oder Passwort falsch.';
          setTimeout(() => {
            this.error = false;
          }, 2000);
      }
    } else {
      console.log('Anmeldeformular ist ungültig.');
    }
  }



  onGuestLogin(): void {
    
    const loginCard = document.querySelector('.login');
    
 
    loginCard?.classList.add('slide-out-down');
    
    
    setTimeout(() => {
      this.router.navigate(['/main']); 
    }, 800);
  }

  openSignUp(){
     
       const loginCard = document.querySelector('.login');
    
     
       loginCard?.classList.add('slide-out-down');
       
     
       setTimeout(() => {
        this.router.navigate(['/signUp']) 
       }, 800);
    
  }
}
