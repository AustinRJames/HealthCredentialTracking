import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
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

  // Get all departments
  getDepartments() : Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  // Create department (Admin Only)
  createDepartment(department : Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  // Assign required cert to department
  requireCertification(departmentId: number, certId: number) : Observable<any> { 
    return this.http.post(`${this.apiUrl}/${departmentId}/require-cert/${certId}`, {});
  }
}