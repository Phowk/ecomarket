import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth';

// guards/guard.ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      map(isAuth => {
        if (!isAuth) {
          console.log('Acceso denegado');
          this.router.navigate(['/login']);
;
        } else
        console.log('denegado');
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}