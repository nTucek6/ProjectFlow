import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Select } from '../model/select';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private http: HttpClient = inject(HttpClient);

  searchUsers(search: string): Observable<Select[]> {
    let params = new HttpParams().set('search', search)
    return this.http.get<Select[]>(`${this.apiUrl}/find`, { params });

  }
}
