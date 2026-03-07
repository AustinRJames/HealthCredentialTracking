import { Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable } from 'rxjs';


// Mapping to C# backend
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
}

export interface Certification {
  id: number;
  name: string;
  validityPeriodMonth: number;
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

  // Create signal to see if token exists when the app first loads
  isLoggedInSignal = signal<boolean>(this.getToken() !== null);

  // Dependency Injection
  constructor(private http: HttpClient) {}

  // Method to fetch data
  getEmployeeCertifications() : Observable<EmployeeCertification[]> {
    return this.http.get<EmployeeCertification[]>(`${this.baseUrl}/EmployeeCertification`);
  }

  // Get all employees for drop down
  getEmployees() : Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/Employees`);
  }

  // Get all certifications
  getCertifications() : Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.baseUrl}/Certifications`);
  }

  // Post new assignment to the database
  assignCertifications(payload : any) : Observable<any> {
    return this.http.post(`${this.baseUrl}/EmployeeCertification`, payload);
  }

  // Post new employee to database
  createEmployee(payload : any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Employees`, payload);
  }

  // Post new certification to database
  createCertifications(payload : any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Certifications`, payload);
  }

  // Delete employee based on ID
  deleteEmployee(id : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Employees/${id}`);
  }

  // Delete cert based on ID
  deleteCertification(id : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Certifications/${id}`);
  }

  revokeCertification(employeeId : number, certId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/EmployeeCertification/${employeeId}/${certId}`);
  }


  // Send username/password to backend to get token
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/Login`, credentials);
  }

  // Save token to browser's local storage
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.isLoggedInSignal.set(true);
  }

  // Get token from wallet
  getToken(): string | null {
    return localStorage.getItem('jwt_token');``
  }

  // Throw token away
  logout(): void {
    localStorage.removeItem('jwt_token');
    this.isLoggedInSignal.set(false);
  }

}
