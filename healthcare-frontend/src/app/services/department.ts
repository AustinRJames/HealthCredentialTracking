import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5285/api/department';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  requireCertification(departmentId: number, certId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${departmentId}/require-cert/${certId}`, {});
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
