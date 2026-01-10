import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';


import { UserCredentials } from '@shared/model/user-credentials';
//import { UserCredentials } from '../model/user-credentials';
import { UserDto } from '@shared/dto/user.dto';
//import { UserDto } from '../dto/user.dto';
import { RegisterRequestDto } from '@shared/dto/register-request.dto';
//import { RegisterRequestDto } from '../dto/register-request.dto';

import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.authUrl}`;

  private http: HttpClient = inject(HttpClient);

  private authorizedSubject = new BehaviorSubject<boolean>(false);
  isAuthorized$ = this.authorizedSubject.asObservable();

  private toast = inject(NgToastService);

  private userSubject = new BehaviorSubject<UserDto | null>(null);
  user$ = this.userSubject.asObservable();

  authenticate(userCredentials: UserCredentials): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, userCredentials).pipe(
      tap(() => this.authorizedSubject.next(true)),
      catchError((error: HttpErrorResponse) => {
        //alert(error.error);
        this.toast.danger(error.error);
        return throwError(() => error);
      })
    );
  }

  register(userCredentials: RegisterRequestDto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, userCredentials).pipe(
      tap(() => console.log('Successful')),
      catchError((error: HttpErrorResponse) => {
        this.toast.danger(error.error);
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
    return this.userSubject.getValue()?.name + ' ' + this.userSubject.getValue()?.surname;
  }
   getUserRole() {
    return this.userSubject.getValue()?.roleText;
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`).pipe(
      map(() => true),
      catchError((err) => {
        return of(false);
      })
    );
  }

  isMentorTokenValid(token: string): Observable<boolean> {
    const params = {
      verifyToken: token,
    };
    return this.http.get<boolean>(`${this.apiUrl}/verifyMentorToken`, { params }).pipe(
      map(() => false),
      catchError((err) => {
        console.log(err);
        this.toast.danger(err.error);
        return of(true);
      })
    );
  }

  getUser(userId: Number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  refreshToken(): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/refreshToken`, null).pipe(
      tap((user) => {
        this.userSubject.next(user);
        this.authorizedSubject.next(true);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, null).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.authorizedSubject.next(false);
      })
    );
  }

  verifyUser(token: String): Observable<boolean> {
    const params = {
      verifyToken: token.toString(),
    };
    return this.http.get<boolean>(`${this.apiUrl}/verify`, { params });
  }

  resendVerifyToken(token: String): Observable<boolean> {
    const params = {
      verifyToken: token.toString(),
    };
    return this.http.get<boolean>(`${this.apiUrl}/resendtoken`, { params });
  }

  initializeAuth(): Promise<void> {
    return firstValueFrom(
      this.refreshToken().pipe(
        catchError(() => {
          this.userSubject.next(null);
          this.authorizedSubject.next(false);
          return of(null);
        })
      )
    ).then(() => void 0);
  }
}
