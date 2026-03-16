import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5285/api';

  isLoggedInSignal = signal<boolean>(this.getToken() !== null);

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/Login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.isLoggedInSignal.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.isLoggedInSignal.set(false);
  }
}
