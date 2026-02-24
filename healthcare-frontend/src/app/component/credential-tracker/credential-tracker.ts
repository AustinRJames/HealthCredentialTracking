import { Component, OnInit } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { Api, EmployeeCertification } from '../../services/api'

@Component({
  selector: 'app-credential-tracker',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './credential-tracker.html',
  styleUrl: './credential-tracker.css'
})

export class CredentialTrackerComponent implements OnInit {
  // Holds data from backend
  certifications: EmployeeCertification[] = [];

  // Inject the service 
  constructor(private api : Api) {}

  // Runs automatically when the component loads on the screen
  ngOnInit(): void {
      this.api.getEmployeeCertifications().subscribe({
        next: (data) => {
          this.certifications = data; // Save data to array
          console.log('Data loaded successfully', data);
        },
        error: (err) => console.error('API error', err)
      });
  }
}