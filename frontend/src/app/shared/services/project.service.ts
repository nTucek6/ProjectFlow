import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectDto } from '../dto/project.dto';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProjectFilterParams } from '../model/project-filter-params';
import { SearchProjectDto } from '../dto/search-project.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/project`;

  private http: HttpClient = inject(HttpClient);

  fetchProjects(
    page: number,
    size: number,
    eventFilterParams?: ProjectFilterParams,
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

    if (eventFilterParams != undefined) {
      Object.entries(eventFilterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'startDateTimeFrom' || key === 'startDateTimeTo') {
            const dateObj = new Date(value);
            params = params.set(key, formatLocalDateTime(dateObj));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<SearchProjectDto[]>(`${this.apiUrl}`, {params});
  }
}
