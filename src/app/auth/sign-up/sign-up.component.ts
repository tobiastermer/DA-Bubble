import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../shared/firebase-services/auth.service';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import {
  slideAnimation,
  slideInUpAnimation,
  slideOutDownAnimation,
} from '../../shared/services/animations';

@Component({
  selector: 'app-sign-up',
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  animations: [slideInUpAnimation, slideOutDownAnimation, slideAnimation],
})
export class SignUpComponent implements OnInit {
  animationState = 'in';

  ngOnInit(): void {
    this.prefillForm();
  }
  signUpForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private afAuth: Auth
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [Validators.required, Validators.email, this.emailDomainValidator],
        [this.emailAsyncValidator.bind(this)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.upperCaseValidator,
          this.specialCharValidator,
        ],
      ],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  formatName(name: string): string {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  emailAsyncValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return from(this.authService.emailExists(control.value)).pipe(
      map((exists) => (exists ? { emailExists: true } : null))
    );
  }

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email.includes('@')) {
      return { emailAtSymbolMissing: true };
    }
    const domainPart = email.substring(email.lastIndexOf('@') + 1);
    if (!domainPart.includes('.')) {
      return { emailDomainDotMissing: true };
    }
    return null;
  }

  prefillForm() {
    if (typeof window !== 'undefined') {
      const tempUserData = JSON.parse(localStorage.getItem('tempUser') || '{}');
      if (tempUserData.email && tempUserData.name) {
        this.signUpForm.patchValue({
          name: tempUserData.name,
          email: tempUserData.email,
        });
      }
    }
  }

  upperCaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { upperCase: true };
  }

  specialCharValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSpecialChar ? null : { specialChar: true };
  }

  getFirstPasswordError() {
    const passwordErrors = this.signUpForm.get('password')?.errors;
    if (!passwordErrors) return null;

    if (passwordErrors['required']) return 'Passwort eingeben';
    if (
      passwordErrors['minlength'] ||
      passwordErrors['upperCase'] ||
      passwordErrors['specialChar']
    ) {
      return 'Min. 6 Zeichen, 1 Großbuchstaben, 1 Sonderzeichen';
    }

    return null;
  }

  getFirstEmailError() {
    const emailErrors = this.signUpForm.get('email')?.errors;
    if (!emailErrors) return null;

    if (emailErrors['required']) return 'E-Mail eingeben';
    if (emailErrors['email']) return 'Bitte richtige E-Mail eingeben';
    if (emailErrors['emailExists'])
      return 'Diese E-Mail-Adresse wird bereits verwendet.';

    return null;
  }

  showErrors() {
    this.signUpForm.markAllAsTouched();
  }

  openLogin() {
    this.animationState = 'out';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 850);
  }

  async onSubmit() {
    this.formSubmitted = true;
    if (this.signUpForm.valid) {
      let { email, password, name } = this.signUpForm.value;
      name = this.formatName(name);
      email = email.toLowerCase();
      localStorage.setItem(
        'tempUser',
        JSON.stringify({ name, email, password })
      );

      localStorage.setItem(
        'tempUser',
        JSON.stringify({ name, email, password })
      );

      setTimeout(() => {
        this.router.navigate(['/select-avatar']);
      }, 800);
    } else {
      console.log('Formular ist ungültig.');
    }
  }

  changeAnimationState(newState: string) {
    this.animationState = newState;
  }
}
