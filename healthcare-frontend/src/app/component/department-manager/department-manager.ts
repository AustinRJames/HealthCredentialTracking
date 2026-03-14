import { Component, OnInit, signal } from '@angular/core';
import { DepartmentService, Department } from '../../services/department';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-manager.html',
  styleUrl: './department-manager.css',
})
export class DepartmentManager implements OnInit{
  // departments: Department[] = [];
  departments = signal<Department[]>([]);
  newDepartmentName: string = '';

  // Inject our new service
  constructor(private departmentService: DepartmentService) {}

  // Runs once when component loads
  ngOnInit(): void {
      this.loadDepartments();
  }

  loadDepartments(): void {
    // Subscribe to Observable
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error Fetching departments', err)
    });
  }

  createDepartment(): void {
    if (!this.newDepartmentName.trim()) return ; // Don't allow empty names

    const newDept = { name: this.newDepartmentName };

    this.departmentService.createDepartment(newDept).subscribe({
      next: (createdDept) => {
        // Push new dept into our array
        this.loadDepartments();
        this.newDepartmentName = ''; // Clear output
      },
      error: (err) => console.error('Error creating department', err)
    });
  }

}

