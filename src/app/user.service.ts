import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../app/models/users'; // ✅ Ensure correct model import

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api'; // ✅ Corrected API base URL

  constructor(private http: HttpClient) {}

  /**
   * ✅ Generates authentication headers.
   */
  private getAuthHeaders(): HttpHeaders {
    const username = 'user'; // Replace with actual username
    const password = 'password'; // Replace with actual password
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`), // ✅ Basic Auth
      'Content-Type': 'application/json'
    });
  }

  /**
   * ✅ Register a new user.
   */
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('❌ Error registering user:', error);
        return throwError(() => new Error('Error registering user.'));
      })
    );
  }

  /**
   * ✅ Get all users (For Dropdown Selection)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('❌ Error fetching users:', error);
        return throwError(() => new Error('Error fetching users.'));
      })
    );
  }

  /**
   * ✅ Log in a user and store authentication details.
   */
  loginUser(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ Login successful.');
      }),
      catchError(error => {
        console.error('❌ Error logging in:', error);
        return throwError(() => new Error('Invalid username or password.'));
      })
    );
  }

  /**
   * ✅ Log out user.
   */
  logoutUser(): void {
    console.log('✅ User logged out successfully');
  }
}
