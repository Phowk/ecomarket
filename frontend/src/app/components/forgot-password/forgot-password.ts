import { Component, OnInit } from '@angular/core';
import { AuthService} from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink,FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit{
  email: string = '';
  password: string = '';

  ngOnInit(): void { }

  constructor(private auth: AuthService) {}
  
  resetPassword(email: string) {
  if (!email) {
    alert("Por favor completa el campo de correo electrónico.");
    return;
  };

  this.auth.recoverPassword(email);
}

}
