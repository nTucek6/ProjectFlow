import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '@shared/services/api/auth.service';
import { UserCredentials } from '../../../shared/model/user-credentials';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    TranslatePipe,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  email: string = '';
  password: string = '';

  formSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Molimo unesite email i lozinku.');
      return;
    }

    const userCredentials: UserCredentials = {
      email: this.email,
      password: this.password,
    };

    this.authService.authenticate(userCredentials).subscribe((response) => {
      console.log(response);
      this.authService.setUser(response);
      this.router.navigate(['/']);
    });
  }
}
