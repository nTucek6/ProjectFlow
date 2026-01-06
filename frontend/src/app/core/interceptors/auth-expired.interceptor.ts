import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '@shared/services/api/auth.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  private authService = inject(AuthService);

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.message === 'Access token expired'
        ) {
          this.isRefreshing = true;
          this.authService.refreshToken();

          console.log('Interceptor called');

          this.refreshTokenSubject.next(null);

          return this.authService.refreshToken().pipe(
            switchMap(() => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(true);
              return next.handle(req);
            }),
            catchError((err) => {
              this.isRefreshing = false;
              //this.authService.logout();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
