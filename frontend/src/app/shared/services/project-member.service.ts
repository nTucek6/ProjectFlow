import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProjectMemberDto } from '../dto/project-member.dto';
import { Observable } from 'rxjs';
import { ProjectRole } from '../enums/project-role.enum';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private apiUrl = `${environment.apiUrl}/project-members`;

  private http: HttpClient = inject(HttpClient);

  fetchProjectMembers(projectId: number): Observable<ProjectMemberDto[]> {
    return this.http.get<ProjectMemberDto[]>(`${this.apiUrl}/project/${projectId}`);
  }

  updateUserRole(id: number, role: ProjectRole): Observable<void>{
   return this.http.put<void>(`${this.apiUrl}/${id}`, {role: role})
  }

}
