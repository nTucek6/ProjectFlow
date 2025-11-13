import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-login',
  imports: [MatButtonModule, TranslatePipe, FormsModule, CommonModule,RouterLink,MatInputModule,MatFormFieldModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
   private router = inject(Router);

    email: string = '';
  password: string = '';

  formSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Molimo unesite email i lozinku.');
      return;
    }

     this.router.navigate(['/']);

    /*const userCredentials: UserCredentials = {
      email: this.email,
      password: this.password,
    };

    this.authService.authenticate(userCredentials).subscribe((response) => {
      this.authService.setUser(response);
      this.router.navigate(['/']);
    }); */
  }

}
