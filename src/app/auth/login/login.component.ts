import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';
import { Auth } from '@angular/fire/auth'; // wichtig @angular/fire/auth NICHT @fire/auth
import { AuthService } from '../../shared/firebase-services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '0.5s ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean = false;
  error = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: Auth,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLoginSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(
          this.afAuth,
          email,
          password
        );
        console.log('User Credentials:', userCredential);
        if (userCredential.user && userCredential.user.emailVerified) {
         
          const uid = userCredential.user.uid;
          this.router.navigate([`/${uid}/chat/idChat`]); 
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
      this.router.navigate(['/Guest/newMsg/abc']);
    }, 800);
  }

  openSignUp() {
    const loginCard = document.querySelector('.login');

    loginCard?.classList.add('slide-out-down');

    setTimeout(() => {
      this.router.navigate(['/signUp']);
    }, 800);
  }

  async onGoogleSignIn() {
    try {
      const userCredential = await this.authService.signInWithGoogle();
      // Direkter Zugriff auf uid, wenn userCredential bereits ein User-Objekt ist
      const uid = userCredential.uid;
      this.router.navigate([`/${uid}/chat/idChat`]);
    } catch (error) {
      console.error('Fehler', error);
    }
  }

  openPwReset() {
    const loginCard = document.querySelector('.login');

    loginCard?.classList.add('slide-out-down');

    setTimeout(() => {
      this.router.navigate(['/pw-reset']);
    }, 800);
  }
}
