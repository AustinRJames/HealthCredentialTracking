import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, Certification, EmployeeCertification } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { CertificationService } from '../../services/certification.service';

@Component({
  selector: 'app-certification-assignment',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './certification-assignment.html',
  styleUrl: 'certification-assignment.css',
})
export class CertificationAssignmentComponent implements OnInit {
  certifications = signal<EmployeeCertification[]>([]);
  employeeList = signal<Employee[]>([]);
  certList = signal<Certification[]>([]);

  newAssignment = {
    employeeId: '',
    certificationId: '',
    dateCompleted: ''
  };

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private certService: CertificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.certService.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
    this.employeeService.getEmployees().subscribe(data => this.employeeList.set(data));
    this.certService.getCertifications().subscribe(data => this.certList.set(data));
  }

  onSubmit(): void {
    const certId = Number(this.newAssignment.certificationId);
    const selectedCert = this.certList().find(c => c.id == certId);

    if (!selectedCert) {
      alert('Please select valid cert!');
      return;
    }

    const completedDate = new Date(this.newAssignment.dateCompleted);

    const payload = {
      employeeId: Number(this.newAssignment.employeeId),
      certificationId: Number(this.newAssignment.certificationId),
      dateCompleted: completedDate.toISOString(),
      status: 0
    };

    this.certService.assignCertifications(payload).subscribe({
      next: () => {
        this.certService.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
        this.newAssignment = { employeeId: '', certificationId: '', dateCompleted: '' };
      },
      error: (err) => {
        console.error('Error saving:', err);
        alert('Something went wrong. Check the console.');
      }
    });
  }

  onRevoke(employeeId: number, certId: number): void {
    const isConfirmed = confirm('Are you sure you want to revoke this certification?');

    if (isConfirmed) {
      this.certService.revokeCertification(employeeId, certId).subscribe({
        next: () => {
          this.certifications.update(list =>
            list.filter(c => !(c.employeeId === employeeId && c.certificationId === certId))
          );
        },
        error: (err) => {
          console.error('Error Revoking cert:', err);
          alert('Could not revoke. Check Console.');
        }
      });
    }
  }
}
