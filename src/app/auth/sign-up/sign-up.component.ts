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

  /**
   * Initializes the component and pre-fills the form if data is available.
   */
  ngOnInit(): void {
    this.prefillForm();
  }
  signUpForm: FormGroup;
  formSubmitted: boolean = false;
  hidePassword = true;

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

  /**
   * Formats the user's name to have each word start with an uppercase letter.
   * @param {string} name - The name to format.
   * @returns {string} The formatted name.
   */
  formatName(name: string): string {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Asynchronous validator that checks if an email already exists in the system.
   * @param {AbstractControl} control - The form control for the email.
   * @returns {Observable<ValidationErrors | null>} An observable emitting validation errors or null.
   */
  emailAsyncValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return from(this.authService.emailExists(control.value)).pipe(
      map((exists) => (exists ? { emailExists: true } : null))
    );
  }

  /**
   * Validator for the email domain to ensure it includes an '@' symbol and a valid domain part.
   * @param {AbstractControl} control - The form control for the email.
   * @returns {ValidationErrors | null} Validation errors or null.
   */
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
      return { emailDomainInvalid: true };
    }
    return null;
  }

  /**
   * Pre-fills the form with user data from local storage if available.
   */
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

  /**
   * Validator to check for at least one uppercase letter in the password.
   * @param {AbstractControl} control - The form control for the password.
   * @returns {ValidationErrors | null} Validation errors or null.
   */
  upperCaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { upperCase: true };
  }

  /**
   * Validator to check for at least one special character in the password.
   * @param {AbstractControl} control - The form control for the password.
   * @returns {ValidationErrors | null} Validation errors or null.
   */
  specialCharValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSpecialChar ? null : { specialChar: true };
  }

  /**
   * Retrieves and displays the first encountered error for the password field.
   * @returns {string | null} The error message or null if no error.
   */
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

  /**
   * Retrieves and displays the first encountered error for the email field.
   * @returns {string | null} The error message or null if no error.
   */
  getFirstEmailError() {
    const emailErrors = this.signUpForm.get('email')?.errors;
    if (!emailErrors) return null;
  
    if (emailErrors['required']) return 'E-Mail eingeben';
    if (emailErrors['email']) return 'Bitte richtige E-Mail eingeben';
    if (emailErrors['emailExists']) return 'Diese E-Mail-Adresse wird bereits verwendet.';
    if (emailErrors['emailDomainInvalid']) return 'Bitte eine gültige E-Mail-Adresse eingeben.';
  
    return null;
  }

  /**
   * Marks all form controls as touched to show validation errors.
   */
  showErrors() {
    this.signUpForm.markAllAsTouched();
  }

  /**
   * Navigates to the login page with a sliding animation.
   */
  openLogin() {
    this.animationState = 'out';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 850);
  }

  /**
   * Handles the form submission, performs validation, and navigates to the avatar selection page.
   */
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

  /**
   * Changes the animation state for transition effects.
   * @param {string} newState - The new state for the animation.
   */
  changeAnimationState(newState: string) {
    this.animationState = newState;
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  openImprint() {
    this.router.navigate(['/imprint']);
  }

  openPrivacy() {
    this.router.navigate(['/privacy'])
  }
}
