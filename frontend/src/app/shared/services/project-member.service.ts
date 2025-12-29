import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProjectMemberDto } from '../dto/project-member.dto';
import { Observable } from 'rxjs';
import { ProjectRole } from '../enums/project-role.enum';
import { UpdateLastAccessedDto } from '../dto/last-accessed.dto';
import { ProjectDto } from '../dto/project.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private apiUrl = `${environment.apiUrl}/project-members`;

  private http: HttpClient = inject(HttpClient);

  fetchProjectMembers(projectId: number, search: string): Observable<ProjectMemberDto[]> {
    const params = {
      search: search,
    };

    return this.http.get<ProjectMemberDto[]>(`${this.apiUrl}/project/${projectId}`, { params });
  }

  updateUserRole(id: number, role: ProjectRole): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { role: role });
  }

  updateUserLastAccessed(userId: number, projectId: number): Observable<void> {
    const dto: UpdateLastAccessedDto = {
      userId: userId,
      projectId: projectId,
    };
    return this.http.put<void>(`${this.apiUrl}/lastAccessed`, dto );
  }


  getRecentUserProjects(userId: number) : Observable<ProjectDto[]>{
     return this.http.get<ProjectDto[]>(`${this.apiUrl}/user/${userId}`);
  }

}
