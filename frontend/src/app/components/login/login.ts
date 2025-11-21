import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  

  private auth = inject(AuthService);
  private router = inject(Router);


  loading = signal(false);
  errorMsg = signal('');

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  login() {
    if (!this.email || !this.password) {
      this.errorMsg.set('Por favor completa todos los campos');
      return;
    }

    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          setTimeout(() => {
            this.router.navigate(['/catalogo']);
            console.log('Login exitoso');
          });
        }

      },
      error: (error) => {
        this.loading.set(false);
        this.errorMsg.set(error.error?.error || 'Credenciales incorrectas');
      }
    });
  }

}
