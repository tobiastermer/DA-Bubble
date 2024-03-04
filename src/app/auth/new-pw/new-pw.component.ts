import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { applyActionCode, confirmPasswordReset } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { DataService } from '../../shared/services/data.service';
import { slideInUpAnimation } from '../../shared/services/animations';

@Component({
  selector: 'app-new-pw',
  standalone: true,
  imports: [ MatInputModule,MatCardModule, MatIconModule, FormsModule, MatFormFieldModule, ReactiveFormsModule,CommonModule],
  templateUrl: './new-pw.component.html',
  styleUrl: './new-pw.component.scss',
  animations: [
  slideInUpAnimation
  ],
})
export class NewPwComponent implements OnInit {
  pwResetForm: FormGroup;
  oobCode: string | null = null;
  showSuccessPopup = false; 
  isPasswordReset = false;
  isEmailVerify = false;
  newEmailVerify = false;
  mode: string | null = null;
  


  constructor(private fb: FormBuilder,private firestore: Firestore ,private dataservice:DataService, private route: ActivatedRoute, private afAuth: Auth, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.pwResetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],      
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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

  verifyEmail() {
    if (isPlatformBrowser(this.platformId)) { 
      this.isEmailVerify = true;
    
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  async updatetEmail() {
    if (isPlatformBrowser(this.platformId)) { 
      this.newEmailVerify = true;
       
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }
  }

  

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

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


openLogin(){
  const signUpCard = document.querySelector('.pw-reset');
 
   signUpCard?.classList.add('slide-out-down');
     

   setTimeout(() => {
    this.router.navigate(['/login']);
   }, 800);
  
}
}
