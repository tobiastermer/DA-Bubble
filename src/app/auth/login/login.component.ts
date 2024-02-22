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
import { UserService } from '../../shared/firebase-services/user.service';

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
    trigger('errorAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '0.5s ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s ease-out',
          style({ transform: 'translateY(100%)', opacity: 0 })
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
  guestUserId: string = 'PT4yYauqYDFGDbalSPkk';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: Auth,
    private authService: AuthService,
    private userService: UserService
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
      await this.loginUser(email, password);
    } else {
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const emailInLowerCase = email.toLowerCase();
      const userCredential = await signInWithEmailAndPassword(
        this.afAuth,
        emailInLowerCase,
        password
      );
      this.handleSuccessfulLogin(userCredential);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleSuccessfulLogin(userCredential: any) {
    if (userCredential.user && userCredential.user.emailVerified) {
      const uid = userCredential.user.uid;
      this.navigateToChat(uid);
    } else {
      this.showError('Bitte Account verifizieren.');
    }
  }

  navigateToChat(uid: string) {
    this.router.navigate([`/${uid}/chat/idChat`]);
  }

  showError(message: string) {
    this.error = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.error = false;
    }, 2000);
  }

  handleError(error: any) {
    this.showError('Email oder Passwort falsch.');
  }

  async onGuestLogin(uid: string): Promise<void> {
    const loginCard = document.querySelector('.login');
    loginCard?.classList.add('slide-out-down');

    try {
      const guestData = await this.userService.getUserByID('guestUserId');

      setTimeout(() => {
        this.router.navigate([`/${uid}/chat/idChat`]);
      }, 800);
    } catch (error) {}
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
