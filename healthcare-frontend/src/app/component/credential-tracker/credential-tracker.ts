import { Component, OnInit, signal } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Api, Certification, Employee, EmployeeCertification } from '../../services/api'

@Component({
  selector: 'app-credential-tracker',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
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
  constructor(private api : Api) {}

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
    // Construct payload send and some dummy data. Backend will overwrite it
    const payload = {
      employeeId: Number(this.newAssignment.employeeId),
      certificationId: Number(this.newAssignment.certificationId),
      dateCompleted: this.newAssignment.dateCompleted,
      expirationDate: new Date().toISOString(),
      status: 0
    };

    // Send it to backend
    this.api.assignCertifications(payload).subscribe({
      next: () => {
        this.loadData(); // Refresh table

        // Clear the form
        this.newAssignment = { employeeId: '', certificationId: '', dateCompleted: '' };
      },
      error: (err) => {
        console.error('Error saving', err);
        alert('Something went wrong. Check the console');
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
          alert('Could not delete. Check console.')
        }
      });
    }
  }
}