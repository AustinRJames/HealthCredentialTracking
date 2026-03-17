import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, Department } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department';

@Component({
  selector: 'app-employee-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-manager.html',
  styleUrl: './employee-manager.css'
})
export class EmployeeManagerComponent implements OnInit {
  @Output() employeeDeleted = new EventEmitter<void>();
  @Output() employedEdited = new EventEmitter<void>();

  employeeList = signal<Employee[]>([]);
  departmentList = signal<Department[]>([]);
  selectedEmployee = signal<Employee | null>(null);

  newEmployee = {
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    departmentId: null as number | null
  };

  constructor(
    public authService: AuthService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getEmployees().subscribe(data => this.employeeList.set(data));
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departmentList.set(data),
      error: (err) => console.error('Error loading departments', err)
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
        this.employeeService.getEmployees().subscribe(data => this.employeeList.set(data));
        this.newEmployee = { firstName: '', lastName: '', role: '', email: '', departmentId: null };
      },
      error: (err) => console.error('C# Validation Errors:', err.error)
    });
  }

  onDeleteEmployee(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this employee? This will also delete their assigned certifications.');

    if (isConfirmed) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employeeList.update(list => list.filter(emp => emp.id !== id));
          this.employeeDeleted.emit();
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Could not delete. Check console.');
        }
      });
    }
  }

  onEditEmployee(emp: Employee): void {
    console.log(typeof emp.departmentId, emp.departmentId);

    this.selectedEmployee.set({...emp}); // Spread so you're editing a copy, not original
  }

  onCancelEdit(): void {
    this.selectedEmployee.set(null);
  }

  onUpdateEmployee(): void {
    const emp = this.selectedEmployee();
    if (!emp) return;

    this.employeeService.updateEmployee(emp.id, emp).subscribe({
      next:() => {
        this.employedEdited.emit();
        this.loadData();
        this.selectedEmployee.set(null);
      }, 
      error: (err) => {
        console.log('Could not edit employee', err);
        alert('Could not update employee. See console');
      }
    });
    
  }
}
