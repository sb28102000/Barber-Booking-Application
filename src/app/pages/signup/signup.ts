import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
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

        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="isBarber" [(ngModel)]="isBarber">
          <label class="form-check-label" for="isBarber">I am a Barber (Register as Vendor)</label>
        </div>
        <button class="btn btn-primary w-100" (click)="onRegister()">Sign Up</button>
        
        <div class="text-center mt-3">
          <a routerLink="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  // Data object to send to backend
  registerObj: any = { username: '', password: '', role: 'USER' };
  
  // Variable to track checkbox state
  isBarber: boolean = false; 

  http = inject(HttpClient);
  router = inject(Router);

  onRegister() {
    // 1. Check the box state. If checked, set role to 'BARBER'
    this.registerObj.role = this.isBarber ? 'BARBER' : 'USER';

    // 2. Send to Backend
    this.http.post('http://localhost:8080/api/v1/auth/register', this.registerObj)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Account created! Please login.', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          Swal.fire('Error', 'Registration Failed. Username might be taken.', 'error');
        }
      });
  }
}