import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = 'http://localhost:5285/api';

    constructor(private http: HttpClient) {}

    registerUser(email: string, username: string, password: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/User`, { email, username, password });
    }
}