import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
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

  constructor(private auth: AuthService) {

  }
  ngOnInit(): void {
  }

  register() {
    if(this.email && this.password && this.fullName && this.confirmPassword && (this.password === this.confirmPassword)){
      this.auth.signUp(this.email, this.password, this.fullName)
        .then(() => {
          alert("Registro exitoso. Ahora puedes iniciar sesión.");
          // Redirect to login page
          window.location.href = '/login';
        })
        .catch((error) => {
          alert("Error en el registro: " + error.message);
          console.log("Error en el registro:", error);
        });
    } else if(this.password !== this.confirmPassword){
      alert("Las contraseñas no coinciden.");
    } else {
      alert("Por favor, complete todos los campos.");
    }
  }
}
