import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile, sendPasswordResetEmail} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable, of, throwError } from 'rxjs';
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

  constructor(private http: HttpClient) {}

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
        }
      }),
      map(res => !!res && !!res.token),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    if (!decoded) return false;
    // opcional: comprobar expiración si tu token la incluye
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

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // Expose the current user as an Observable
//   public currentUser$: Observable<User | null>;
//   isAuthenticated$: any;

//   constructor(
//     private auth: Auth,
//     private firestore: Firestore,
//   ) {
//     // AngularFire's `user` observable emits the current user or null
//     this.currentUser$ = user(this.auth);
//   }

//   /**
//    * Registers a new user with email and password.
//    * @param email The user's email.
//    * @param password The user's password.
//    * @returns A Promise that resolves with UserCredential on success.
//    */
//   async signUp(email: string, password: string, fullName: string): Promise<void> {
//     try {
//       // 1. Create the user with email and password using Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//       const firebaseUser = userCredential.user;

//       if (firebaseUser) {
//         // Optional: Update the user's display name in Firebase Auth profile
//         // This is separate from Firestore but can be useful for Auth-based features
//         await updateProfile(firebaseUser, { displayName: fullName });

//         // 2. Save additional user data to Firestore
//         // Use the user's UID as the document ID for the Firestore profile
//         const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);

//         await setDoc(userDocRef, {
//           uid: firebaseUser.uid,
//           email: firebaseUser.email,
//           fullName: fullName,
//           createdAt: new Date(), // Add a timestamp
//           // You can add more fields here like profilePictureUrl, etc.
//         });

//         console.log('User signed up and profile saved to Firestore successfully!', firebaseUser.uid);
//       } else {
//         throw new Error("User was not created by Firebase Auth.");
//       }

//     } catch (error: any) {
//       console.error('Sign up error:', error.message);
//       throw error; // Re-throw to allow component to handle specific errors
//     }
//   }

//   /**
//    * Signs in an existing user with email and password.
//    * @param email The user's email.
//    * @param password The user's password.
//    * @returns A Promise that resolves with UserCredential on success.
//    */
//   async signIn(email: string, password: string): Promise<void> {
//     try {
//       await signInWithEmailAndPassword(this.auth, email, password);
//       console.log('User signed in successfully!');
//     } catch (error: any) {
//       console.error('Sign in error:', error.message);
//       throw error; // Re-throw to allow component to handle
//     }
//   }

//   /**
//    * Signs out the currently authenticated user.
//    * @returns A Promise that resolves when the user is signed out.
//    */
//   async signOut(): Promise<void> {
//     try {
//       await signOut(this.auth);
//       console.log('User signed out successfully!');
//     } catch (error: any) {
//       console.error('Sign out error:', error.message);
//       throw error; // Re-throw to allow component to handle
//     }
//   }

//    async recoverPassword(email: string) {
//     try {
//       await sendPasswordResetEmail(this.auth, email);
//       alert("Si existe una cuenta asociada a ese correo, se ha enviado un email para reestablecer la contraseña.");
//     } catch (error: any) {
//       console.error(error);
//       alert("Error: " + error.message);
//     }
//   }
// }
