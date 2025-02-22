import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './models/groups';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8080/api/groups';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const username = 'user';
    const password = 'password';
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json'
    });
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, { headers: this.getAuthHeaders(), withCredentials: true });
  }

  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group, { headers: this.getAuthHeaders(), withCredentials: true });
  }
}
