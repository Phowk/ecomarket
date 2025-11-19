import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Catalogo } from './components/catalogo/catalogo';
import { Register } from './components/register/register';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ForgotPassword } from './components/forgot-password/forgot-password';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const redirectLoggedInToHome = () => redirectLoggedInTo(['/catalogo']);

export const routes: Routes = [
    { path: '', component: LandingPage },
    {
        path: 'login',
        component: Login,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'catalogo',
        component: Catalogo,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'home', component: LandingPage },
    { path: 'register', component: Register },
    { path: '**', pathMatch: 'full', redirectTo: 'home'},
];
