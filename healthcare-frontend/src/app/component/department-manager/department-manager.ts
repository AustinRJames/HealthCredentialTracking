import { Component, OnInit, signal } from '@angular/core';
import { DepartmentService, Department } from '../../services/department';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, Certification } from '../../services/api'
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-department-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-manager.html',
  styleUrl: './department-manager.css',
})
export class DepartmentManager implements OnInit{
  departments = signal<Department[]>([]);
  certList = signal<Certification[]>([]);
  
  newDepartmentName: string = '';
  selectedCertIds: number[] = [];

  // Inject our new service
  constructor(
    private departmentService: DepartmentService,
    private api: Api
  ) {}

  get isLoggedIn() { 
    return this.api.isLoggedInSignal();
  }

  // Runs once when component loads
  ngOnInit(): void {
      this.loadDepartments();

      this.api.getCertifications().subscribe({
        next: (certs) => this.certList.set(certs),
        error: (err) => console.error("Error loading certs", err)
      });
  }

  loadDepartments(): void {
    // Subscribe to Observable
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error Fetching departments', err)
    });

    this.api.getCertifications().subscribe(data => this.certList.set(data));

  }

  createDepartment(): void {
    if (!this.newDepartmentName.trim()) return ; // Don't allow empty names

    const newDept = { name: this.newDepartmentName };

    this.departmentService.createDepartment(newDept).subscribe({
      next: (createdDept) => {

        if (this.selectedCertIds && this.selectedCertIds.length > 0) {
          // Created an array of HTTP requests (one for each cert selected)
          const assignRequests = this.selectedCertIds.map(certId => 
            this.departmentService.requireCertification(createdDept.id, certId)
          );

          // Run them all the exact same time
          forkJoin(assignRequests).subscribe({
            next: () => {
              // All rules added successfully 
              this.loadDepartments();
              this.resetForm();
            },
            error: (err) => console.error('Error assigning certs to department', err)
          });

        } else {
          // No certs selected, just refresh the screen
          this.loadDepartments();
          this.resetForm();
        }
      },
      error: (err) => console.error('Error creating department', err)
    });
  }

  onDeleteDepartment(id: number): void {
    // Confirm they want to delete
    const isConfirmed = confirm('Are you sure you want to delete this department?')

    if (isConfirmed) {
      // Send delete request
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          // Need to repopulate the list
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting cert: ', err);
          alert('Could not delete. Check console');
        }
      })
    }
  }

  resetForm() {
    this.newDepartmentName = '';
    this.selectedCertIds = [];
  }

}

