import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router)  {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLoginSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      console.log('Login-Daten:', this.loginForm.value);
      // Anmelde-Logik //
    } else {
      console.log('Anmeldeformular ist ungültig.');
    }
  }

  onGuestLogin() {
    this.router.navigate(['/main']); 
  }

  openSignUp(){
    this.router.navigate(['/signUp'])
  }
}
