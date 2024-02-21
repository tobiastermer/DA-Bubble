import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-pw-reset',
  standalone: true,
  imports: [ MatInputModule,MatCardModule, MatIconModule, FormsModule, MatFormFieldModule, ReactiveFormsModule,CommonModule],
  templateUrl: './pw-reset.component.html',
  styleUrl: './pw-reset.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class PwResetComponent {
  sendSuccess = false;
  pwResetForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private afAuth: Auth) {
    this.pwResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  async onSubmit() {
    if (this.pwResetForm.valid) {
      const email = this.pwResetForm.get('email')?.value;
      try {
        await sendPasswordResetEmail(this.afAuth, email, {
          url: 'http://localhost:4200/new-pw', //ändern vor deploy
          handleCodeInApp: true,
        });
        this.sendSuccess = true;
      setTimeout(() => this.router.navigate(['/login']), 2000);
      } catch (error) {
        console.error('Fehler beim Senden', error);
       
      }
    }
  }


  openLogin(){
    const signUpCard = document.querySelector('.pw-reset');
   
     signUpCard?.classList.add('slide-out-down');
       
  
     setTimeout(() => {
      this.router.navigate(['/login']);
     }, 800);
    
  }
}
