import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { UserCredentials } from '../model/user-credentials';
import { UserDto } from '../dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.authUrl}`;

  private http: HttpClient = inject(HttpClient);

  private authorizedSubject = new BehaviorSubject<boolean>(false);
  isAuthorized$ = this.authorizedSubject.asObservable();

  private userSubject = new BehaviorSubject<UserDto | null>(null);
  user$ = this.userSubject.asObservable();

  authenticate(userCredentials: UserCredentials): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, userCredentials).pipe(
      tap(() => this.authorizedSubject.next(true)),
      catchError((error: HttpErrorResponse) => {
        alert(error.error);
        return throwError(() => error);
      })
    );
  }

  setUser(user: UserDto | null): void {
    this.userSubject.next(user);
  }
  getUserId() {
    return this.userSubject.getValue()?.id;
  }
  getUserFirstName() {
    return this.userSubject.getValue()?.name;
  } 

  getUserFullName() {
    return this.userSubject.getValue()?.name + " " + this.userSubject.getValue()?.surname;
  } 

  isLoggedIn(): Observable<boolean> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`).pipe(
      map(() => true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  getUser(userId: Number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  refreshToken(): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.apiUrl}/refreshToken`, null)
      .pipe(tap(() => this.authorizedSubject.next(true)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, null)
      .pipe(tap(() => this.authorizedSubject.next(false)));
  }
}
