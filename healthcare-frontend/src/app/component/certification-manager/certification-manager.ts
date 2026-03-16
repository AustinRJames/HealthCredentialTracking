import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Certification } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { CertificationService } from '../../services/certification.service';

@Component({
  selector: 'app-certification-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certification-manager.html',
  styleUrl: './certification-manager.css'
})
export class CertificationManagerComponent implements OnInit {
  @Output() certificationDeleted = new EventEmitter<void>();

  certList = signal<Certification[]>([]);

  newCert = {
    name: '',
    issuingAuthority: '',
    validityPeriodMonth: 12
  };

  constructor(
    public authService: AuthService,
    private certService: CertificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.certService.getCertifications().subscribe(data => this.certList.set(data));
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

  onDeleteCertification(id: number): void {
    const isConfirmed = confirm('Are you sure you want to delete this certification? This will also delete from Employee Certifications.');

    if (isConfirmed) {
      this.certService.deleteCertification(id).subscribe({
        next: () => {
          this.certList.update(list => list.filter(cert => cert.id !== id));
          this.certificationDeleted.emit();
        },
        error: (err) => {
          console.error('Error deleting cert:', err);
          alert('Could not delete. Check console.');
        }
      });
    }
  }
}
