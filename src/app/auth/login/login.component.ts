import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth'; // wichtig @angular/fire/auth NICHT @fire/auth

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatFormFieldModule,MatInputModule,MatIconModule,MatCheckboxModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  
})
export class LoginComponent {
  loginForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private afAuth: Auth) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLoginSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(this.afAuth, email, password);
        const loginCard = document.querySelector('.login');
        console.log("Angemeldeter:", userCredential.user);
        
        loginCard?.classList.add('slide-out-down');
        
       
        setTimeout(() => {
          this.router.navigate(['/Guest/newMsg/abc']); 
        }, 800);
      } catch (error) {
        console.error('Anmeldefehler', error);
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

  openSignUp(){
     
       const loginCard = document.querySelector('.login');
    
     
       loginCard?.classList.add('slide-out-down');
       
     
       setTimeout(() => {
        this.router.navigate(['/signUp']) 
       }, 800);
    
  }
}
