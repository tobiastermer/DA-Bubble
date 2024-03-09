import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { applyActionCode, confirmPasswordReset } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { DataService } from '../../shared/services/data.service';
import { slideInUpAnimation } from '../../shared/services/animations';

@Component({
  selector: 'app-new-pw',
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
  templateUrl: './new-pw.component.html',
  styleUrl: './new-pw.component.scss',
  animations: [slideInUpAnimation],
})
export class NewPwComponent implements OnInit {
  pwResetForm: FormGroup;
  oobCode: string | null = null;
  showSuccessPopup = false;
  isPasswordReset = false;
  isEmailVerify = false;
  newEmailVerify = false;
  mode: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private dataservice: DataService,
    private route: ActivatedRoute,
    private afAuth: Auth,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.pwResetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  /**
   * Initializes the component, retrieves query parameters from the URL, and determines the mode of the page (password reset, email verification, or update email verification).
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
      this.mode = params['mode'];

      if (this.mode === 'verifyEmail' && this.oobCode) {
        applyActionCode(this.afAuth, this.oobCode);
        this.verifyEmail();
      } else if (this.mode === 'resetPassword' && this.oobCode) {
        this.isPasswordReset = true;
      } else if (this.mode === 'verifyAndChangeEmail' && this.oobCode) {
        applyActionCode(this.afAuth, this.oobCode);
        this.updatetEmail();
      }
    });
  }

  /**
   * Verifies the user's email address using the code from the URL query parameters. If verification is successful, navigates to the login page.
   */
  verifyEmail() {
    if (isPlatformBrowser(this.platformId)) {
      this.isEmailVerify = true;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  /**
   * Updates the user's email address using the code from the URL query parameters. If the update is successful, navigates to the login page.
   */
  async updatetEmail() {
    if (isPlatformBrowser(this.platformId)) {
      this.newEmailVerify = true;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  /**
   * Custom validator for the password reset form. Checks if the password and confirm password fields match.
   * @param {FormGroup} group - The form group that contains the password fields.
   * @returns {Object|null} - An object indicating the validation error, or null if passwords match.
   */
  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  /**
   * Handles the form submission for password reset. If the form is valid and an out-of-band code is present, it attempts to reset the password using Firebase Auth.
   */
  async onSubmit() {
    if (this.pwResetForm.valid && this.oobCode) {
      const password = this.pwResetForm.get('password')?.value;
      try {
        await confirmPasswordReset(this.afAuth, this.oobCode, password);
        this.showSuccessPopup = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } catch (error) {
        console.error('Fehler beim Zurücksetzen des Passworts', error);
      }
    }
  }

  /**
   * Navigates to the login page with an animation effect on the password reset card.
   */
  openLogin() {
    const signUpCard = document.querySelector('.pw-reset');

    signUpCard?.classList.add('slide-out-down');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 800);
  }

  /**
   * Toggles the visibility of the password input field between visible and hidden.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
