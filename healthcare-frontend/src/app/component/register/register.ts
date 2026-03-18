import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
    email = '';
    username = '';
    password = '';
    errorMessage = '';
    successMessage = '';

  constructor(public userService: UserService, private router: Router) {}

  onRegister(): void {
    this.userService.registerUser(this.email, this.username, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Registration failed. Please try again.';
      }
    });
  }
}
