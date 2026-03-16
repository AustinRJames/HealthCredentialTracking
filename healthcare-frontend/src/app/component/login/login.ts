import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(public authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.errorMessage = '';
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
