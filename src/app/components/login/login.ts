import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService} from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(private auth: AuthService) {
  }
  ngOnInit(): void { }

  login() {
    if (this.email && this.password) {
      this.auth.signIn(this.email, this.password).then(() => {
        alert("Inicio de sesión exitoso.");
        // Redirect to home page
        window.location.href = '/catalogo';
      }).catch((error) => {
        alert("Error en el inicio de sesión: " + error.message);
        console.log("Error en el inicio de sesión:", error);
      })
    }
  }

  
}
