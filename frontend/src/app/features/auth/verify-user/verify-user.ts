import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/api/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verify-user',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './verify-user.html',
  styleUrl: './verify-user.scss',
})
export class VerifyUser {
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private router = inject(Router);

  userVerified: boolean = false;

  errorHasOccured: boolean = false;

  sendNewToken: boolean = false;

  errorMessage = '';

  verifyToken = '';

  ngOnInit() {
    const verifyToken = this.activatedRoute.snapshot.paramMap.get('token');

    if (verifyToken != null) {
      this.verifyToken = verifyToken;

      this.authService.verifyUser(this.verifyToken).subscribe({
        next: (response) => {
          this.userVerified = true;
          console.log('User verified: ', response);

          setTimeout(() => {
            this.navigateToLogin();
          }, 3000);
        },
        error: (error) => {
          console.error('Verification failed', error);
          this.errorHasOccured = true;

          if (error.error == 'Token expired!') {
            this.sendNewToken = true;
          }

          this.errorMessage =
            error?.error || error?.error || 'Verification failed. Please try again.';
        },
      });
    }
  }

  resendVerifyToken() {
    this.authService.resendVerifyToken(this.verifyToken).subscribe({
      next: (response) => {
        if (response) {
          this.errorMessage = 'New token has been sent. Check your email.';
          //this.newTokenSent = true;
        }
      },
      error: (error) => {
        console.error('Verification failed', error);
        this.errorHasOccured = true;

        this.errorMessage =
          error?.error || error?.error || 'Verification failed. Please try again.';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
