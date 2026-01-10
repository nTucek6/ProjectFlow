import { Component, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '@shared/services/api/auth.service';
import { RegisterRequestDto } from '../../../shared/dto/register-request.dto';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  imports: [
    TranslatePipe,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);

  private toast = inject(NgToastService);

  private activeRoute = inject(ActivatedRoute);

  messageError: string | null = null;

  token: string | null = null;

  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';

  loading: boolean = false;

  confirmPassword: string = '';

  ngOnInit() {
    const token = this.activeRoute.snapshot.paramMap.get('token');
    if (token != null) this.token = token;
  }

  formSubmit() {
    this.messageError = null;

    if (!this.firstname.trim()) {
      this.messageError = 'Please enter your firstname';
      return;
    }
    if (!this.lastname.trim()) {
      this.messageError = 'Please enter your lastname';
      return;
    }
    if (!this.email.trim()) {
      this.messageError = 'Please enter your email';
      return;
    }
    if (this.password != this.confirmPassword) {
      this.messageError = 'Passwords do not match';
      return;
    }

    this.toggleLoading();

    const userCredentials: RegisterRequestDto = {
      email: this.email,
      password: this.password,
      name: this.firstname,
      surname: this.lastname,
      token: this.token,
    };

    this.authService.register(userCredentials).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/register-success']);
        this.toggleLoading();
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.toggleLoading();
      },
    });
  }

  toggleLoading() {
    this.loading = !this.loading;
  }
}
