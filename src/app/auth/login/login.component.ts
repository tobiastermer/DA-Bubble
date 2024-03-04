import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { PresenceService } from '../../shared/firebase-services/presence.service';
import { DataService } from '../../shared/services/data.service';
import { doc } from '@angular/fire/firestore';
import { getDoc, setDoc } from 'firebase/firestore';
import { errorAnimation, slideOutDownAnimation } from '../../shared/services/animations';

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
    slideOutDownAnimation,
    errorAnimation
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean = false;
  error = false;
  errorMessage = '';
  guestUserId: string = 'PT4yYauqYDFGDbalSPkk';
  showLoginCard = true;
  isGuestLogin = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: Auth,
    private authService: AuthService,
    private userService: UserService,
    private presenceService: PresenceService,
    private dataService: DataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLoginSubmit() {
    this.formSubmitted = true;
    if (this.isGuestLogin) {
     
      this.onGuestLogin(this.guestUserId);
    } else {
     
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        await this.loginUser(email, password);
      } else {
       
      }
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
      await this.authService.updateEmailInFirestoreIfNeeded(
        userCredential.user.uid,
        emailInLowerCase
      );
      this.handleSuccessfulLogin(userCredential);
    } catch (error) {
      this.handleError(error);
    }
  }

  async handleSuccessfulLogin(userCredential: any) {
    if (userCredential.user && userCredential.user.emailVerified) {
      const uid = userCredential.user.uid;
      this.updateUserStatus(uid);
      const user = await this.userService.getUserByAuthUid(uid);
      if (user) {
        this.dataService.setCurrentUser(user);
        this.navigateToChat(user.id ?? '');
      } else {
        this.showError('Benutzer nicht gefunden.');
      }
    } else {
      this.showError('Bitte Account verifizieren.');
    }
  }

  async updateUserStatus(uid: string) {
    try {
      await this.presenceService.updateOnUserLogin(uid);
    } catch (error) {}
  }

  navigateToChat(userId: string) {
    this.showLoginCard = false;
    setTimeout(() => {
      this.router.navigate([`/${userId}`]);
      this.showLoginCard = true;
    }, 800);
    
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

  async onGuestLogin(userId: string): Promise<void> {
    this.isGuestLogin = true;
    this.removeValidators();

    try {
      const guestData = await this.userService.getUserByID(this.guestUserId);
      await this.presenceService.updateGuestStatus("t8WOIhqo9BYogI9FmZhtCHP7K3t1", 'online');
      this.presenceService.startGuestTracking();
      
      this.showLoginCard = false;

      setTimeout(() => {
        
        this.dataService.setCurrentUser(guestData!);
        this.router.navigate([`/${userId}`]);
        this.showLoginCard = true;
        this.isGuestLogin = false;
        
      }, 800);
    } catch (error) {
      console.error('Fehler beim Gastlogin', error);
    }
  }

  openSignUp() {
    this.showLoginCard = false;
    setTimeout(() => {
      this.router.navigate(['/signUp']);
      this.showLoginCard = true;
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


  removeValidators() {
    this.loginForm.get('email')!.clearValidators(); 
    this.loginForm.get('email')!.updateValueAndValidity();
    this.loginForm.get('password')!.clearValidators();
    this.loginForm.get('password')!.updateValueAndValidity();
  }
  
}
