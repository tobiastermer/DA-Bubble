import { Component } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../shared/firebase-services/auth.service';
import { slideInUpAnimation } from '../../shared/services/animations';

@Component({
  selector: 'app-pw-reset',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './pw-reset.component.html',
  styleUrl: './pw-reset.component.scss',
  animations: [slideInUpAnimation],
})
export class PwResetComponent {
  sendSuccess = false;
  errorMessage = false;
  pwResetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: Auth,
    private authService: AuthService
  ) {
    this.pwResetForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, this.emailDomainValidator],
      ],
    });
  }

  /**
   * Handles the form submission for sending a password reset email.
   */
  async onSubmit() {
    if (this.pwResetForm.valid) {
      const email = this.pwResetForm.get('email')?.value;
      try {
        const exists = await this.authService.emailExists(email);
        if (!exists) {
          this.errorMessage = true;
          setTimeout(() => {
            this.errorMessage = false;
          }, 1500);
          return;
        }
        await sendPasswordResetEmail(this.afAuth, email);
        this.sendSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } catch (error) {
        console.error('Fehler beim Senden', error);
      }
    }
  }

  /**
   * Custom validator for the email input to ensure it includes an '@' symbol and a domain.
   * @param {AbstractControl} control - The form control for the email input.
   * @returns Validation error object or null.
   */
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

  /**
   * Retrieves the first error message for the email input field to display to the user.
   * @returns The error message string or null if no error exists.
   */
  getFirstEmailError() {
    const emailErrors = this.pwResetForm.get('email')?.errors;
    if (!emailErrors) return null;

    if (emailErrors['required']) return 'E-Mail eingeben';
    if (emailErrors['email']) return 'Bitte richtige E-Mail eingeben';

    return 'Bitte richtige E-Mail eingeben';

    return null;
  }

  /**
   * Navigates to the login page with an animation.
   */
  openLogin() {
    const signUpCard = document.querySelector('.pw-reset');

    signUpCard?.classList.add('slide-out-down');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 800);
  }
}
