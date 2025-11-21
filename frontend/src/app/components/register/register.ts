import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgClass, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private auth = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = ''
  confirmPassword: string = '';
  fullName: string = '';
  showPassword: boolean = false;
  showConfPassword: boolean = false;

  toggleConfPassword() {
    this.showConfPassword = !this.showConfPassword;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  loading = signal(false);
  errorMsg = signal('');

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  register() {
    if (!this.email || !this.password || !this.confirmPassword || !this.fullName) {
      this.errorMsg.set('Por favor completa todos los campos');
      return;
    }
    else if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden');
      return;
    }
    else if (!this.validateEmail(this.email)) {
      this.errorMsg.set('El correo no es válido');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.auth.register(this.email, this.password, 'user', this.fullName).subscribe({
      next: () => {
        this.loading.set(false);
        window.location.href = '/catalogo';
        this.router.navigate(['/catalogo']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMsg.set(error.error?.error || 'No se pudo registrar el usuario');
      }
    });
  }

}
