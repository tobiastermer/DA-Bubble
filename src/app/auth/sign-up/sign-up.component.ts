import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.upperCaseValidator, this.specialCharValidator]],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  // PW VALIDATOR FOR 1 UPPERCASE
  upperCaseValidator(control: AbstractControl): ValidationErrors | null {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { upperCase: true };
  }

  // PW VALIDATOR SPECIAL CHAR
  specialCharValidator(control: AbstractControl): ValidationErrors | null {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSpecialChar ? null : { specialChar: true };
  }

  // COMBINED PASSWORD ERRORS FUNCTION
  getFirstPasswordError() {
    const passwordErrors = this.signUpForm.get('password')?.errors;
    if (!passwordErrors) return null;

    if (passwordErrors['required']) return 'Passwort eingeben';
    if (passwordErrors['minlength']) return 'Mindestens 6 Zeichen eingeben';
    if (passwordErrors['upperCase']) return 'Mindestens einen Großbuchstaben eingeben';
    if (passwordErrors['specialChar']) return 'Mindestens ein Sonderzeichen eingeben';

    return null;
  }

  showErrors() {
    this.signUpForm.markAllAsTouched();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.signUpForm.valid) {
      console.log('Formular-Daten:', this.signUpForm.value);
      //Route zu select Avatar //
    } else {
      console.log('ungültig.');
    }
  }}
