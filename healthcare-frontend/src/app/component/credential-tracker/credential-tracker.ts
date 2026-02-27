import { Component, OnInit } from '@angular/core'
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
  // Holds data from backend
  certifications: EmployeeCertification[] = [];

  // Variables for drop downs
  employeeList: Employee[] = [];
  certList: Certification[] = [];

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
    // Load main table
    this.api.getEmployeeCertifications().subscribe({
      next: (data) => {
        this.certifications = data;
        console.log('TABLE DATA ARRIVED:', data);
      },
      error: (err) => console.error('TABLE FETCH ERROR:', err)
    });
    // this.api.getEmployeeCertifications().subscribe(data => this.certifications = data);
    // Load dropdown list
    this.api.getEmployees().subscribe(data => this.employeeList = data);
    // this.api.getCertifications().subscribe(data => this.certList = data);
    this.api.getCertifications().subscribe({
      next: (data) => {
        this.certList = data;
        console.log('CERT DATA ARRIVED:', data);
      },
      error: (err) => console.error('TABLE FETCH ERROR:', err)
    });
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
        alert('Success! Certification assigned.');
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
        alert("Employee Created!");
        // Reload lists
        this.api.getEmployees().subscribe(data => this.employeeList = data);
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
        this.api.getCertifications().subscribe(data => this.certList = data);
        // Clear from
        this.newCert = { name: '', issuingAuthority: '', validityPeriodMonth: 12 };
      },
      error: (err) => console.error('Error creating certification', err)
    });
  }
}