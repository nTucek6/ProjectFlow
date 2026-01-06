import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDto } from '@shared/dto/task.dto';
import { CreateTaskDto } from '@shared/dto/create-task.dto';

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

  fetchUserTop3Tasks(projectId: number, userId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/project/${projectId}/${userId}`);
  }

  getAllProjectTasks(projectId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/all/${projectId}`);
  }

  saveTask(task: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${this.apiUrl}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  updateTask(task: TaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${this.apiUrl}/${task.id}`, task);
  }

  reorderTask(reorderTask: TaskDto[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/reorder`, reorderTask);
  }
}
