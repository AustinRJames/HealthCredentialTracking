import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Api, Certification, Employee, EmployeeCertification } from '../../services/api'
import { DepartmentManager } from '../department-manager/department-manager'

@Component({
  selector: 'app-credential-tracker',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, DepartmentManager],
  templateUrl: './credential-tracker.html',
  styleUrl: './credential-tracker.css'
})

export class CredentialTrackerComponent implements OnInit {

  certifications = signal<EmployeeCertification[]>([]);
  employeeList = signal<Employee[]>([]);
  certList = signal<Certification[]>([]);

  // This object holds info for dropdowns
  newAssignment = {
    employeeId: '',
    certificationId: '',
    dateCompleted: ''
  };

  // Data for new employee
  newEmployee = {
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    email: ''
  };

  // Data for new cert
  newCert = {
    name: '',
    issuingAuthority: '',
    validityPeriodMonth: 12
  };



  // Inject the service 
  constructor(public api : Api) {}

  // Runs automatically when the component loads on the screen
  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
    this.api.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
    this.api.getEmployees().subscribe(data => this.employeeList.set(data));
    this.api.getCertifications().subscribe(data => this.certList.set(data));
  }

  onSubmit(): void {
    const certId = Number(this.newAssignment.certificationId); // Get ID
    const selectedCert = this.certList().find(c => c.id == certId); // Get specific cert

    if (!selectedCert) {
      alert('Please select valid cert!');
      return;
    }

    // Date math
    const completedDate = new Date(this.newAssignment.dateCompleted);
    const expirationDate = new Date(completedDate);

    expirationDate.setMonth(expirationDate.getMonth() + selectedCert.validityPeriodMonth);


    // Construct payload send and some dummy data. Backend will overwrite it
    const payload = {
      employeeId: Number(this.newAssignment.employeeId),
      certificationId: Number(this.newAssignment.certificationId),
      dateCompleted: completedDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      status: 0
    };

    // Send it to backend
    this.api.assignCertifications(payload).subscribe({
      next: () => {
        // Refresh the main table signal to show the new assignment
        this.api.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
        
        // Clear the form
        this.newAssignment = { employeeId: '', certificationId: '', dateCompleted: '' };
      },
      error: (err) => {
        console.error('Error saving:', err);
        alert('Something went wrong. Check the console.');
      }
    });
  }

  onSubmitEmployee(): void {
    this.api.createEmployee(this.newEmployee).subscribe({
      next: () => {
        // Reload lists
        this.api.getEmployees().subscribe(data => this.employeeList.set(data));
        // Clear form
        this.newEmployee = { firstName: '', lastName: '', role: '', department: '', email: '' };
      },
      error: (err) => console.error('Error creating employee!', err)
    });
  }

  onSubmitCertification(): void {
    this.api.createCertifications(this.newCert).subscribe({
      next: () => {
        alert("Certification Created!");
        // Reload lists
        this.api.getCertifications().subscribe(data => this.certList.set(data));

        // Clear from
        this.newCert = { name: '', issuingAuthority: '', validityPeriodMonth: 12 };
        
      },
      error: (err) => console.error('Error creating certification', err)
    });
  }

  onDeleteEmployee(id: number): void {
    // Confirm they want to delete
    const isConfirmed = confirm('Are you sure you want to delete this employee? This will also delete their assigned certifications.');  

    if (isConfirmed) {
      // Send delete request
      this.api.deleteEmployee(id).subscribe({
        next: () => {
          this.employeeList.update(currentList => currentList.filter(emp => emp.id !== id));
                    // Refresh the table
          // this.employeeList = this.employeeList.filter(emp => emp.id !== id);
          this.api.getEmployeeCertifications().subscribe(data => this.certifications.set(data));

        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Could not delete. Check console.');
        }
      });
    }
  }

  onDeleteCertification(id: number): void {
    // Confirm they want to delete
    const isConfirmed = confirm('Are you sure you want to delete this certification? This will also delete from Employee Certifications.');

    if (isConfirmed) {
      // Send delete request
      this.api.deleteCertification(id).subscribe({
        next: () => {
          this.certList.update(currentList => currentList.filter(cert => cert.id !== id));

          this.api.getEmployeeCertifications().subscribe(data => this.certifications.set(data));
        },
        error: (err) => {
          console.error('Error deleting cert:', err);
          alert('Could not delete. Check console.');
        }
      })
    }
  }

  onRevoke(employeeId: number, certId: number): void {
    const isConfirmed = confirm('Are you sure you want to revoke this certification?')

    if (isConfirmed) {
      this.api.revokeCertification(employeeId, certId).subscribe({
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