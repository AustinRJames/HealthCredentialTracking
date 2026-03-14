import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

// Define Department in ts
export interface Department {
  id: number,
  name: string,
  requiredCerts?: any[];
}

@Injectable({
  providedIn: 'root'
})

export class DepartmentService {
  private apiUrl = 'http://localhost:5285/api/department';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` // Note the space after Bearer!
      })
    };
  }

  // Get all departments
  getDepartments() : Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, this.getAuthHeaders());
  }

  // Create department (Admin Only)
  createDepartment(department : Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department, this.getAuthHeaders());
  }

  // Assign required cert to department
  requireCertification(departmentId: number, certId: number) : Observable<any> { 
    return this.http.post(`${this.apiUrl}/${departmentId}/require-cert/${certId}`, {}, this.getAuthHeaders());
  }

  // Delete department
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}