import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // Make sure this is imported

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  
  http = inject(HttpClient);
  router = inject(Router);

  onLogin() {
    const loginObj = { username: this.username, password: this.password };
    
    this.http.post('http://localhost:8080/api/v1/auth/login', loginObj).subscribe({
      next: (res: any) => { 
        if (res.accessToken) {
            localStorage.setItem('token', res.accessToken);
            
            // Show Success
            const Toast = Swal.mixin({
              toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
            });
            Toast.fire({ icon: 'success', title: 'Signed in successfully' });

            // --- NEW LOGIC: USE THE REAL ROLE ---
            // The backend now sends "role": "BARBER" or "USER"
            if (res.role === 'ADMIN') {
              this.router.navigate(['/admin']);
            } 
            else if (res.role === 'BARBER') {
              this.router.navigate(['/barber-portal']);
            } 
            else {
              this.router.navigate(['/booking']);
            }
        }
      },
      error: (err) => {
        Swal.fire('Login Failed', 'Invalid Username or Password', 'error');
      }
    });
  }
}