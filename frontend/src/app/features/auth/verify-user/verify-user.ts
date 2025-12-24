import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-verify-user',
  imports: [MatButtonModule],
  templateUrl: './verify-user.html',
  styleUrl: './verify-user.scss',
})
export class VerifyUser {
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private router = inject(Router);

  userVerified: boolean = false;

  verifyToken = '';

  ngOnInit() {
    const verifyToken = this.activatedRoute.snapshot.paramMap.get('token');

    if (verifyToken != null) {
      this.verifyToken = verifyToken;
    }
  }

  verifyUser() {
    this.authService.verifyUser(this.verifyToken).subscribe((response) => {
      if (response) {
        this.userVerified = response;
        console.log('User verified');
        alert("User verified!")
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
