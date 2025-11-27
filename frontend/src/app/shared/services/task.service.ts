import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDto } from '../dto/task.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/task`;

  private http: HttpClient = inject(HttpClient);

  fetchProjectTasks(projectId: number, page: number, size: number): Observable<TaskDto[]> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<TaskDto[]>(`${this.apiUrl}/project/${projectId}`, { params });
  }

  fetchUserTop3Tasks(projectId:number, userId:number): Observable<TaskDto[]> {
    
    return this.http.get<TaskDto[]>(`${this.apiUrl}/project/${projectId}/${userId}`);
  }

}
