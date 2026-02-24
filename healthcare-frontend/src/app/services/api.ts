import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';


// Mapping to C# backend
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Certification {
  id: number;
  name: string;
}

export interface EmployeeCertification {
  employeeId: number;
  certificationId: number;
  dateCompleted: string;
  expirationDate: string;
  status: string;
  employee: Employee;
  certification: Certification;
}


@Injectable({
  providedIn: 'root',
})
export class Api {
  // Point to .NET backend port
  private baseUrl = 'http://localhost:5285/api';

  // Dependency Injection
  constructor(private http: HttpClient) {}

  // Method to fetch data
  getEmployeeCertifications() : Observable<EmployeeCertification[]> {
    return this.http.get<EmployeeCertification[]>(`${this.baseUrl}/EmployeeCertification`);
  }
}
