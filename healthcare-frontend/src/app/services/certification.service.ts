import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification, EmployeeCertification } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  private baseUrl = 'http://localhost:5285/api';

  constructor(private http: HttpClient) {}

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.baseUrl}/Certifications`);
  }

  createCertifications(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Certifications`, payload);
  }

  deleteCertification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Certifications/${id}`);
  }

  getEmployeeCertifications(): Observable<EmployeeCertification[]> {
    return this.http.get<EmployeeCertification[]>(`${this.baseUrl}/EmployeeCertification`);
  }

  assignCertifications(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/EmployeeCertification`, payload);
  }

  revokeCertification(employeeId: number, certId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/EmployeeCertification/${employeeId}/${certId}`);
  }
}
