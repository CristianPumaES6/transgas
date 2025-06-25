import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log('✅ Login correcto:', this.email, this.password);
    // lógica real aquí
  }

  onForgotPassword() {
    console.log('👉 Redirigir a recuperación de contraseña');
    // Aquí puedes redirigir a otra ruta, abrir modal, etc.
  }
}