import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub?: { email?: string; role?: string };
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambia la base URL si tu backend corre en otro host/puerto
  private readonly API = 'http://127.0.0.1:5000/api';
  private readonly TOKEN_KEY = 'auth_token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loggedInSubject.next(this.isLoggedIn());
  }

  initLoginState() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      this.loggedInSubject.next(!!token);
    }
  }

  register(email: string, password: string, role: string = 'user', fullName: string = ''): Observable<any> {
    const payload = { email, password, role, fullName };
    return this.http.post(`${this.API}/auth/register`, payload).pipe(
      tap(res => {
        // opcional: no guardamos token aquí porque el endpoint de register
        // normalmente no devuelve token. Si devuelve token, podrías guardarlo.
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.token) {
          this.setToken(res.token);
          this.loggedInSubject.next(true);
        }
      }),
      map(res => !!res && !!res.token),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
  private hasToken(): boolean {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) return false;

      const decoded = this.decodeToken(token);
      if (!decoded) return false;

      if (decoded.exp) {
        return decoded.exp > Math.floor(Date.now() / 1000);
      }
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
  }

  private setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null; // evita error
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null; // nunca lanza excepción
    }
  }

isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;

  const decoded = this.decodeToken(token);
  if (!decoded) return false;

  if (decoded.exp) {
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  }

  return true;
}

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    // Dependiendo de cómo guardes el identity en Flask, el rol puede estar en sub.role
    if (!decoded) return null;
    // intenta varias ubicaciones comunes
    if ((decoded as any).role) return (decoded as any).role;
    if ((decoded as any).sub && (decoded as any).sub.role) return (decoded as any).sub.role;
    return null;
  }

  getFullName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    // Está en claims adicionales
    if ((decoded as any).full_name) return (decoded as any).full_name;
    if ((decoded as any).sub && (decoded as any).sub.full_name) return (decoded as any).sub.full_name;
    return null;
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode(token) as DecodedToken;
    } catch (e) {
      console.warn('Token inválido al decodificar:', e);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    // Normaliza errores para components
    if (error.error instanceof ErrorEvent) {
      // cliente
      console.error('Error cliente:', error.error.message);
      return throwError(() => ({ message: error.error.message }));
    } else {
      // servidor
      return throwError(() => ({ status: error.status, message: error.error || error.statusText }));
    }
  }
}
