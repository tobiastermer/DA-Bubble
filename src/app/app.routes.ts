import { Routes } from '@angular/router';
import { StartAnimationComponent } from './auth/start-animation/start-animation.component';
import { LoginComponent } from './auth/login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SelectAvatarComponent } from './auth/select-avatar/select-avatar.component';

export const routes: Routes = [
    { path: '', component: StartAnimationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'select-avatar', component: SelectAvatarComponent },
    { path: ':idUser/:chat/:idChat', component: MainContentComponent }
];
