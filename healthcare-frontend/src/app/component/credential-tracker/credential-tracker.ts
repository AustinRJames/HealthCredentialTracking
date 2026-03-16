import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Certification, Employee, EmployeeCertification } from '../../models/models'
import { AuthService } from '../../services/auth.service'
import { EmployeeService } from '../../services/employee.service'
import { CertificationService } from '../../services/certification.service'
import { DepartmentManager } from '../department-manager/department-manager'
import { DepartmentService } from '../../services/department'
import { Department } from '../../models/models'

@Component({
  selector: 'app-credential-tracker',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, DepartmentManager],
  templateUrl: './credential-tracker.html',
  styleUrl: './credential-tracker.css'
})
export class CredentialTrackerComponent implements OnInit {

  certifications = signal<EmployeeCertification[]>([]);
  departmentList = signal<Department[]>([]);
  employeeList = signal<Employee[]>([]);
  certList = signal<Certification[]>([]);

  newAssignment = {
    employeeId: '',
    certificationId: '',
    dateCompleted: ''
  };

  newEmployee = {
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    departmentId: null
  };

  newCert = {
    name: '',
    issuingAuthority: '',
    validityPeriodMonth: 12
  };

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private certService: CertificationService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.certService.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
    this.employeeService.getEmployees().subscribe(data => this.employeeList.set(data));
    this.certService.getCertifications().subscribe(data => this.certList.set(data));
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departmentList.set(data),
      error: (err) => console.error('Error loading departments', err)
    });
  }

  onSubmit(): void {
    const certId = Number(this.newAssignment.certificationId);
    const selectedCert = this.certList().find(c => c.id == certId);

    if (!selectedCert) {
      alert('Please select valid cert!');
      return;
    }

    const completedDate = new Date(this.newAssignment.dateCompleted);
    const expirationDate = new Date(completedDate);
    expirationDate.setMonth(expirationDate.getMonth() + selectedCert.validityPeriodMonth);

    const payload = {
      employeeId: Number(this.newAssignment.employeeId),
      certificationId: Number(this.newAssignment.certificationId),
      dateCompleted: completedDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
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

  onSubmitEmployee(): void {
    const payload = {
      firstName: this.newEmployee.firstName,
      lastName: this.newEmployee.lastName,
      role: this.newEmployee.role,
      email: this.newEmployee.email,
      departmentId: this.newEmployee.departmentId
    };

    this.employeeService.createEmployee(payload).subscribe({
      next: () => {
        alert('Employee Created!');
        this.newEmployee = { firstName: '', lastName: '', role: '', email: '', departmentId: null };
      },
      error: (err) => {
        console.error('C# Validation Errors:', err.error);
      }
    });
  }

  onSubmitCertification(): void {
    this.certService.createCertifications(this.newCert).subscribe({
      next: () => {
        alert('Certification Created!');
        this.certService.getCertifications().subscribe(data => this.certList.set(data));
        this.newCert = { name: '', issuingAuthority: '', validityPeriodMonth: 12 };
      },
      error: (err) => console.error('Error creating certification', err)
    });
  }

  onDeleteEmployee(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this employee? This will also delete their assigned certifications.');

    if (isConfirmed) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employeeList.update(currentList => currentList.filter(emp => emp.id !== id));
          this.certService.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Could not delete. Check console.');
        }
      });
    }
  }

  onDeleteCertification(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this certification? This will also delete from Employee Certifications.');

    if (isConfirmed) {
      this.certService.deleteCertification(id).subscribe({
        next: () => {
          this.certList.update(currentList => currentList.filter(cert => cert.id !== id));
          this.certService.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
        },
        error: (err) => {
          console.error('Error deleting cert:', err);
          alert('Could not delete. Check console.');
        }
      });
    }
  }

  onRevoke(employeeId: number, certId: number): void {
    const isConfirmed = confirm('Are you sure you want to revoke this certification?');

    if (isConfirmed) {
      this.certService.revokeCertification(employeeId, certId).subscribe({
        next: () => {
          this.certifications.update(currentList =>
            currentList.filter(c => !(c.employeeId === employeeId && c.certificationId === certId))
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
