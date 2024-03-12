import { Routes } from '@angular/router';
import { StartAnimationComponent } from './auth/start-animation/start-animation.component';
import { LoginComponent } from './auth/login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SelectAvatarComponent } from './auth/select-avatar/select-avatar.component';
import { PwResetComponent } from './auth/pw-reset/pw-reset.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { ImprintComponent } from './auth/imprint/imprint.component';
import { PrivacyPolicyComponent } from './auth/privacy-policy/privacy-policy.component';


export const routes: Routes = [
    { path: '', component: StartAnimationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'pw-reset', component: PwResetComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: 'verify', component: VerifyComponent },
    { path: 'select-avatar', component: SelectAvatarComponent },
    { path: ':idUser', component: MainContentComponent },
    { path: ':idUser/:chat/:idChat', component: MainContentComponent },
     
];
