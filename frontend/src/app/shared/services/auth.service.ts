import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserCredentials } from '../model/user-credentials';
import { UserDto } from '../dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
   private apiUrl = `${environment.apiUrl}/user`;

   private http: HttpClient = inject(HttpClient);

  private authorizedSubject = new BehaviorSubject<boolean>(false);
  isAuthorized$ = this.authorizedSubject.asObservable();

  private userSubject = new BehaviorSubject<UserDto | null>(null);
  user$ = this.userSubject.asObservable();

  authenticate(userCredentials: UserCredentials): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.apiUrl}/login`, userCredentials)
      .pipe(
        tap(() => this.authorizedSubject.next(true)),
        catchError((error: HttpErrorResponse) => {
          alert(error.error);
          return throwError(() => error);
        })
      );
  }

  setUser(user: UserDto): void {
    this.userSubject.next(user);
  }
    getUserId() {
    return this.userSubject.getValue()?.id;
  }


    getUser(userId: Number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`)
  }


}
