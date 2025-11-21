import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Usuario ya logueado → redirigir a catálogo
      this.router.navigate(['/catalogo']);
      return false; // impedir acceso a login
    }
    return true; // permitir acceso a login
  }
}
