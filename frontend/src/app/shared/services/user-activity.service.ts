import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserActivityDto } from '../dto/user-activity.dto';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  private apiUrl = `${environment.apiUrl}/user-activity`;
  private http: HttpClient = inject(HttpClient);

  fetchRecentActivities(userId: number): Observable<UserActivityDto[]> {
    return this.http.get<UserActivityDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  logUserActivity(activity: UserActivityDto): Observable<UserActivityDto> {
    return this.http.post<UserActivityDto>(`${this.apiUrl}`, activity);
  }
}
