import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, updateProfile, sendPasswordResetEmail} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Expose the current user as an Observable
  public currentUser$: Observable<User | null>;
  isAuthenticated$: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    // AngularFire's `user` observable emits the current user or null
    this.currentUser$ = user(this.auth);
  }

  /**
   * Registers a new user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns A Promise that resolves with UserCredential on success.
   */
  async signUp(email: string, password: string, fullName: string): Promise<void> {
    try {
      // 1. Create the user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        // Optional: Update the user's display name in Firebase Auth profile
        // This is separate from Firestore but can be useful for Auth-based features
        await updateProfile(firebaseUser, { displayName: fullName });

        // 2. Save additional user data to Firestore
        // Use the user's UID as the document ID for the Firestore profile
        const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);

        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: fullName,
          createdAt: new Date(), // Add a timestamp
          // You can add more fields here like profilePictureUrl, etc.
        });

        console.log('User signed up and profile saved to Firestore successfully!', firebaseUser.uid);
      } else {
        throw new Error("User was not created by Firebase Auth.");
      }

    } catch (error: any) {
      console.error('Sign up error:', error.message);
      throw error; // Re-throw to allow component to handle specific errors
    }
  }

  /**
   * Signs in an existing user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns A Promise that resolves with UserCredential on success.
   */
  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error; // Re-throw to allow component to handle
    }
  }

  /**
   * Signs out the currently authenticated user.
   * @returns A Promise that resolves when the user is signed out.
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      throw error; // Re-throw to allow component to handle
    }
  }

   async recoverPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert("Si existe una cuenta asociada a ese correo, se ha enviado un email para reestablecer la contraseña.");
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
  }
}
