import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <--- 1. Import RouterLink
import { HttpClient } from '@angular/common/http'; // <--- 2. Use HttpClient directly

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // <--- 3. Add RouterLink to imports
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
        
        <p class="mt-3 text-center">
          New user? <a routerLink="/signup">Create an account</a>
        </p>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  
  http = inject(HttpClient); // Inject HttpClient directly
  router = inject(Router);

  onLogin() {
    const loginObj = { username: this.username, password: this.password };
    
    this.http.post('http://localhost:8080/api/v1/auth/login', loginObj).subscribe({
      next: (res: any) => { 
        if (res.accessToken) {
            localStorage.setItem('token', res.accessToken);
            
            // CHECK: Is this the Admin?
            if (this.username === 'admin') {
              this.router.navigate(['/admin']); // Go to Dashboard
            } else {
              this.router.navigate(['/booking']); // Go to Regular Booking
            }
        }
      },
      error: (err) => {
        console.error(err);
        alert('Login Failed. Check username/password.');
      }
    });
  }
}