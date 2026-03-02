import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api'

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private api: Api) {}

  onSubmit(): void {
    this.api.login(this.credentials).subscribe({
      next: (response) => {
        // Save token to browser's wallet
        this.api.setToken(response.token);

        // Clear error message
        this.errorMessage = '';
        alert('Login successful!')
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }

}
