import { Component, OnInit, signal } from '@angular/core';
import { DepartmentService } from '../../services/department';
import { Department } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CertificationService } from '../../services/certification.service';
import { Certification } from '../../models/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-department-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-manager.html',
  styleUrl: './department-manager.css',
})
export class DepartmentManager implements OnInit {
  departments = signal<Department[]>([]);
  certList = signal<Certification[]>([]);
  selectedDepartment = signal<Department | null>(null);

  newDepartmentName: string = '';
  selectedCertIds: number[] = [];
  editCertIds = signal<number[]>([]);


  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private certService: CertificationService
  ) {}

  get isLoggedIn() {
    return this.authService.isLoggedInSignal();
  }

  ngOnInit(): void {
    this.loadDepartments();

    this.certService.getCertifications().subscribe({
      next: (certs) => this.certList.set(certs),
      error: (err) => console.error('Error loading certs', err)
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: (err) => console.error('Error Fetching departments', err)
    });

    this.certService.getCertifications().subscribe(data => this.certList.set(data));
  }

  createDepartment(): void {
    if (!this.newDepartmentName.trim()) return;

    const newDept = { name: this.newDepartmentName };

    this.departmentService.createDepartment(newDept).subscribe({
      next: (createdDept) => {
        if (this.selectedCertIds && this.selectedCertIds.length > 0) {
          const assignRequests = this.selectedCertIds.map(certId =>
            this.departmentService.requireCertification(createdDept.id, certId)
          );

          forkJoin(assignRequests).subscribe({
            next: () => {
              this.loadDepartments();
              this.resetForm();
            },
            error: (err) => console.error('Error assigning certs to department', err)
          });
        } else {
          this.loadDepartments();
          this.resetForm();
        }
      },
      error: (err) => console.error('Error creating department', err)
    });
  }

  onDeleteDepartment(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this department?');

    if (isConfirmed) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (err) => {
          console.error('Error deleting cert: ', err);
          alert('Could not delete. Check console');
        }
      });
    }
  }

  onEditDepartment(dept: Department): void {
    this.selectedDepartment.set({...dept});
    // Pull cert IDs out of requiredCerts array
    const ids = (dept.requiredCerts ?? []).map((rc: any) => rc.certificationId ?? rc.id);
    this.editCertIds.set(ids);
  }

  isEditCertSelected(certId: number): boolean {
    return this.editCertIds().includes(certId);
  }

  toggleEditCert(certId: number): void {
    const current = this.editCertIds();
    if (current.includes(certId)) {
      this.editCertIds.set(current.filter(id => id !== certId));
    } else {
      this.editCertIds.set([...current, certId]);
    }
  }

  onCancelEdit(): void {
    this.selectedDepartment.set(null);
  }

  onUpdateDepartment(): void {
    const dept = this.selectedDepartment();
    if (!dept) return;

    const originalIds = (dept.requiredCerts ?? []).map((rc: any) => rc.certificationId ?? rc.id);
    const newIds = this.editCertIds();

    const toAdd = newIds.filter(id => !originalIds.includes(id));
    const toRemove = originalIds.filter((id: number) => !newIds.includes(id));

    this.departmentService.updateDepartment(dept.id, dept).subscribe({
      next:() => {
        const addReqs = toAdd.map((id: number) => this.departmentService.requireCertification(dept.id, id));
        const removeReqs = toRemove.map((id: number) => this.departmentService.unrequireCertification(dept.id, id));

        forkJoin([...addReqs, ...removeReqs]).subscribe({
          next: () => { this.loadDepartments(); this.selectedDepartment.set(null); },
          error: (err) => console.error(err)
        });
      },
      error: (err) => {
        console.log('Could not edit department', err);
        alert('Could not edit department');
      }
    });
  }

  resetForm() {
    this.newDepartmentName = '';
    this.selectedCertIds = [];
  }
}
