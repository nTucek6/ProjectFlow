import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, pipe, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment.development';
//import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl = `${environment.apiUrl}`;
  private authUrl = `${environment.authUrl}`;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (request.url.startsWith('http') &&
        !(this.apiUrl && request.url.startsWith(this.apiUrl)) &&
        !(this.authUrl && request.url.startsWith(this.authUrl)))
    ) {
      return next.handle(request);
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    request = request.clone({
      headers: headers,
      withCredentials: true,
    });

    if (this.authUrl + '/me' || this.authUrl + '/refreshToken') {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Global HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }
}
