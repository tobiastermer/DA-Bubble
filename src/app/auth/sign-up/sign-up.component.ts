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
export class SignUpComponent implements OnInit {
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
    const tempUserData = JSON.parse(localStorage.getItem('tempUser') || '{}');
    if (tempUserData.email && tempUserData.name) {
      this.signUpForm.patchValue({
        name: tempUserData.name,
        email: tempUserData.email,
      });
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
    if (passwordErrors['minlength']) return 'Mindestens 6 Zeichen eingeben';
    if (passwordErrors['upperCase'])
      return 'Mindestens einen Großbuchstaben eingeben';
    if (passwordErrors['specialChar'])
      return 'Mindestens ein Sonderzeichen eingeben';

    return null;
  }

  showErrors() {
    this.signUpForm.markAllAsTouched();
  }

  openLogin() {
    const signUpCard = document.querySelector('.sign-up');

    signUpCard?.classList.add('slide-out-down');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 800);
  }

  async onSubmit() {
    this.formSubmitted = true;
    if (this.signUpForm.valid) {
      const { email, password, name } = this.signUpForm.value;
      localStorage.setItem(
        'tempUser',
        JSON.stringify({ name, email, password })
      );

      const signUpCard = document.querySelector('.sign-up');

      localStorage.setItem(
        'tempUser',
        JSON.stringify({ name, email, password })
      );

      signUpCard?.classList.add('slide-out-down');

      setTimeout(() => {
        this.router.navigate(['/select-avatar']);
      }, 800);
    } else {
      console.log('Formular ist ungültig.');
    }
  }
}
