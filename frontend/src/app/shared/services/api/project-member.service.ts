import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ProjectMemberDto } from '@shared/dto/project-member.dto';
import { Observable } from 'rxjs';
import { ProjectRole } from '@shared/enums/project-role.enum';
import { UpdateLastAccessedDto } from '@shared/dto/last-accessed.dto';
import { ProjectDto } from '@shared/dto/project.dto';
import { Select } from '@shared/model/select';


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

  searchProjectMembers(projectId: number, search: string): Observable<Select[]> {
    const params = {
      search: search,
    };
    return this.http.get<Select[]>(`${this.apiUrl}/searchUser/${projectId}`, { params });
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
