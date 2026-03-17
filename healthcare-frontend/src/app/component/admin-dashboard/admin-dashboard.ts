import { Component, ViewChild } from '@angular/core';
import { EmployeeManagerComponent } from '../employee-manager/employee-manager';
import { CertificationManagerComponent } from '../certification-manager/certification-manager';
import { CertificationAssignmentComponent } from '../certification-assignment/certification-assignment';
import { DepartmentManager } from '../department-manager/department-manager';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    EmployeeManagerComponent,
    CertificationManagerComponent,
    CertificationAssignmentComponent,
    DepartmentManager,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent {
  @ViewChild(CertificationAssignmentComponent) certAssignRef!: CertificationAssignmentComponent;

  onEmployeeDeleted(): void {
    this.certAssignRef.loadData();
  }

  onCertificationDeleted(): void {
    this.certAssignRef.loadData();
  }

  onEmployeeUpdated(): void {
    this.certAssignRef.loadData();
}

}
