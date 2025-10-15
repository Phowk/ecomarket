import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';

export const routes: Routes = [
    { path: '' , component: LandingPage},
    { path: 'login', component: Login},
    { path: 'home', component: LandingPage},
    { path: '**', pathMatch: 'full' , redirectTo: 'login' }
];
