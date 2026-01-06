import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/api/auth.service';
import { map, tap } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

export const authMentorRegisterGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const authService = inject(AuthService);
  const toast = inject(NgToastService);

  const token = route.paramMap.get('token');
  if (token != null) {
    return authService.isMentorTokenValid(token).pipe(
      tap((isTokenValid) => {
        if (isTokenValid) {
          router.navigate(['/register']);
          //toast.danger('Mentor register token is invalid!');
        }
      }),
      map((isTokenValid) => !isTokenValid)
    );
  }
  return false;
};
