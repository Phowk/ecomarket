import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Catalogo } from './components/catalogo/catalogo';
import { Register } from './components/register/register';

export const routes: Routes = [
    { path: '' , component: LandingPage},
    { path: 'catalogo', component: Catalogo},
    { path: 'login', component: Login},
    { path: 'home', component: LandingPage},
    { path: 'register', component: Register},
    { path: '**', pathMatch: 'full' , redirectTo: 'home' },
];
