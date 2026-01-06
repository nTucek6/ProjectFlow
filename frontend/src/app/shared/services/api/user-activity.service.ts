import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { UserActivityDto } from '@shared/dto/user-activity.dto';


@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  private apiUrl = `${environment.apiUrl}/user-activity`;
  private http: HttpClient = inject(HttpClient);

  fetchRecentActivities(userId: number): Observable<UserActivityDto[]> {
    return this.http.get<UserActivityDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  fetchProjectRecentActivities(projectId: number) : Observable<UserActivityDto[]> {
    return this.http.get<UserActivityDto[]>(`${this.apiUrl}/project/${projectId}`);
  }

  /*logUserActivity(activity: UserActivityDto): Observable<UserActivityDto> {
    return this.http.post<UserActivityDto>(`${this.apiUrl}`, activity);
  } */
}
