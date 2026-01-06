import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProjectFilterParams } from '@shared/model/project-filter-params';
import { environment } from 'environments/environment';
import { ProjectDto } from '@shared/dto/project.dto';
import { ChatMessageDto } from '@shared/dto/chat-message.dto';
import { SearchProjectDto } from '@shared/dto/search-project.dto';
import { NewProjectDto } from '@shared/dto/new-project.dto';
import { UpdateProjectDto } from '@shared/dto/update-project.dto';
import { DashboardSummaryDto } from '@shared/dto/dashboard-summary.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/project`;
  private apiChatUrl = `${environment.apiUrl}/chat`;

  private http: HttpClient = inject(HttpClient);

  private projectSubject = new BehaviorSubject<ProjectDto | null>(null);
  project$ = this.projectSubject.asObservable();

  private chatSubject = new BehaviorSubject<ChatMessageDto[] | null>([]);
  chat$ = this.chatSubject.asObservable();

  fetchProjects(
    page: number,
    size: number,
    projectFilterParams?: ProjectFilterParams,
    ascending?: boolean,
    sortBy?: string
  ): Observable<SearchProjectDto[]> {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const formatLocalDateTime = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
        d.getMinutes()
      )}:${pad(d.getSeconds())}`;

    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (sortBy != undefined) {
      params = params.set('sortBy', sortBy);
    }
    if (ascending != undefined) {
      params = params.set('ascending', ascending.toString());
    }

    if (projectFilterParams != undefined) {
      Object.entries(projectFilterParams).forEach(([key, value]) => {
        value = value.toString();
        if (value !== undefined && value !== null && value.length > 0) {
          if (key === 'startDateTimeFrom' || key === 'startDateTimeTo') {
            const dateObj = new Date(value);
            params = params.set(key, formatLocalDateTime(dateObj));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<SearchProjectDto[]>(`${this.apiUrl}`, { params });
  }

  getProjectById(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${id}`);
  }

  createNewProject(newProject: NewProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.apiUrl}`, newProject);
  }

  updateProject(projectId: number,updateProject: UpdateProjectDto) : Observable<ProjectDto>{
    return this.http.put<ProjectDto>(`${this.apiUrl}/${projectId}`, updateProject);
  }

  setProject(project: ProjectDto | null): void {
    this.projectSubject.next(project);
  }

  getProjectId(): number | undefined {
    return this.projectSubject.value?.id;
  }

  setMessages(messages: ChatMessageDto[]){
    this.chatSubject.next(messages);
  }

  recivedMessage(message: ChatMessageDto) {
    const currentChats = this.chatSubject.value ?? [];
    this.chatSubject.next([...currentChats, message]);
  }

  getChatMessages(projectId: number, page: number, size: number): Observable<ChatMessageDto[]> {
    const params = {
      page: page ,
      size: size,
    };
    return this.http.get<ChatMessageDto[]>(`${this.apiChatUrl}/project/${projectId}`, { params });
  }

  getUserSummary(userId: number) : Observable<DashboardSummaryDto>{
     return this.http.get<DashboardSummaryDto>(`${this.apiUrl}/user/${userId}`);
  }

}
