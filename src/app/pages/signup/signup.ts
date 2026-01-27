import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Need this for inputs
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4" style="width: 400px;">
        <h2 class="text-center mb-4">Create Account</h2>
        
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" [(ngModel)]="registerObj.username" class="form-control" placeholder="Choose a username">
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" [(ngModel)]="registerObj.password" class="form-control" placeholder="Choose a password">
        </div>

        <button class="btn btn-primary w-100" (click)="onRegister()">Sign Up</button>
        
        <div class="text-center mt-3">
          <a href="#" (click)="goToLogin($event)">Already have an account? Login</a>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  registerObj: any = {
    username: '',
    password: '',
    role: 'USER'
  };

  http = inject(HttpClient);
  router = inject(Router);

  onRegister() {
    this.http.post('http://localhost:8080/api/v1/auth/register', this.registerObj)
      .subscribe({
        next: (res: any) => {
          alert('✅ Registration Success! Please Login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('❌ Registration Failed. Username might be taken.');
        }
      });
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}