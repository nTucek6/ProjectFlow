import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/api/auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLoggedIn().pipe(
    tap((isLoggedIn) => {
      if (isLoggedIn) {
        router.navigate(['/']);
      }
    }),
    map((isLoggedIn) => !isLoggedIn)
  );
};
