import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// This import will work now because we created the file in Step 1
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 400px;">
      <div class="card-body">
        <h3 class="card-title text-center mb-4">Barber Portal</h3>
        
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" [(ngModel)]="username" class="form-control" placeholder="Enter username">
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" [(ngModel)]="password" class="form-control" placeholder="Enter password">
        </div>

        <button (click)="onLogin()" class="btn btn-primary w-100">
          Secure Login
        </button>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  
  // Inject the service
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    const user = { username: this.username, password: this.password };
    
    // FIX: We explicitly add ': any' to res and err to satisfy strict mode
    this.authService.login(user).subscribe({
      next: (res: any) => { 
        if (res && res.accessToken) {
            this.authService.saveToken(res.accessToken);
            alert('Login Success!');
            this.router.navigate(['/booking']);
        }
      },
      error: (err: any) => {
        console.error(err);
        alert('Login Failed');
      }
    });
  }
}