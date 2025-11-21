import { Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/login/login';
import { Catalogo } from './components/catalogo/catalogo';
import { Register } from './components/register/register';
import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { AuthGuard} from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard-guard';
import { Integrantes } from './components/integrantes/integrantes';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const redirectLoggedInToHome = () => redirectLoggedInTo(['/catalogo']);

export const routes: Routes = [
  { path: '', component: LandingPage },
  {
  path: 'login',
  component: Login,
  canActivate: [LoginGuard],
},
  { path: 'catalogo', component: Catalogo, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'register', component: Register },
  { path: 'integrantes', component: Integrantes},
  { path: '**', redirectTo: '' }
];
