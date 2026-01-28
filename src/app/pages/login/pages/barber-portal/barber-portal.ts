import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barber-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>✂️ Barber Portal</h2>
        <button class="btn btn-danger btn-sm" (click)="logout()">Logout</button>
      </div>

      <div class="row">
        <div class="col-md-4">
          <div class="card shadow p-3 mb-4">
            <h4>My Shop Profile</h4>
            
            <div class="mb-2">
              <label>Shop Name</label>
              <input type="text" [(ngModel)]="barberProfile.name" class="form-control" placeholder="e.g. Steve's Cuts">
            </div>

            <div class="mb-2">
              <label>Specialty</label>
              <input type="text" [(ngModel)]="barberProfile.specialty" class="form-control" placeholder="e.g. Fades">
            </div>

            <div class="mb-2">
              <label>Address</label>
              <input type="text" [(ngModel)]="barberProfile.address" class="form-control" placeholder="e.g. 123 Main St">
            </div>

            <div class="mb-2">
              <label>Mobile Number</label>
              <input type="text" [(ngModel)]="barberProfile.mobileNumber" class="form-control" placeholder="+1 234...">
            </div>

            <div class="mb-2">
              <label>Base Price ($)</label>
              <input type="number" [(ngModel)]="barberProfile.basePrice" class="form-control">
            </div>

            <div class="mb-2">
              <label>Description</label>
              <textarea [(ngModel)]="barberProfile.description" class="form-control" rows="2"></textarea>
            </div>

            <button class="btn btn-primary w-100 mt-2" (click)="saveProfile()">Save Profile</button>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">Incoming Requests</h5>
            </div>
            <div class="card-body p-0">
              <table class="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let appt of myAppointments">
                    <td>{{ appt.customerName }}</td>
                    <td>{{ appt.customerMobile || 'N/A' }}</td>
                    <td>{{ appt.purpose }}</td>
                    <td>
                      <span [ngClass]="{
                        'badge': true,
                        'bg-warning': appt.status === 'PENDING',
                        'bg-success': appt.status === 'CONFIRMED',
                        'bg-danger': appt.status === 'REJECTED'
                      }">{{ appt.status }}</span>
                    </td>
                    <td>
                      <div *ngIf="appt.status === 'PENDING'">
                        <button class="btn btn-success btn-sm me-1" (click)="updateStatus(appt.id, 'CONFIRMED')" title="Accept">✔</button>
                        <button class="btn btn-danger btn-sm" (click)="updateStatus(appt.id, 'REJECTED')" title="Reject">✖</button>
                      </div>

                      <div *ngIf="appt.status !== 'PENDING'">
                         <button class="btn btn-secondary btn-sm" (click)="updateStatus(appt.id, 'PENDING')">Reset</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div *ngIf="myAppointments.length === 0" class="p-4 text-center text-muted">
                No bookings found yet.
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BarberPortalComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  
  username = '';
  // Ensure all fields are initialized
  barberProfile: any = { 
    name: '', specialty: '', address: '', description: '', 
    basePrice: 0, mobileNumber: '', username: '' 
  };
  myAppointments: any[] = [];

  ngOnInit() {
    this.username = this.extractUser();
    if (!this.username) {
      this.router.navigate(['/login']);
      return;
    }
    this.barberProfile.username = this.username;
    this.loadProfile();
    this.loadAppointments();
  }

  extractUser(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).sub; } catch (e) { return ''; }
  }

  loadProfile() {
    this.http.get(`http://127.0.0.1:8081/api/v1/booking/barber/profile/${this.username}`)
      .subscribe({
        next: (data: any) => { if (data) this.barberProfile = data; },
        error: () => console.log('Profile not found yet (First time login)')
      });
  }

  loadAppointments() {
    this.http.get(`http://127.0.0.1:8081/api/v1/booking/barber/appointments/${this.username}`)
      .subscribe((data: any) => {
        this.myAppointments = data;
        this.cdr.detectChanges();
      });
  }

  saveProfile() {
    this.http.post('http://127.0.0.1:8081/api/v1/booking/barber/profile', this.barberProfile)
      .subscribe(() => {
        Swal.fire('Saved!', 'Profile updated successfully.', 'success');
        this.loadProfile();
      });
  }

  updateStatus(id: number, status: string) {
    this.http.put(`http://127.0.0.1:8081/api/v1/booking/appointment/${id}/status?status=${status}`, {})
      .subscribe({
        next: () => {
          // No popup needed for quick actions, just refresh
          this.loadAppointments(); 
        },
        error: () => Swal.fire('Error', 'Could not update status', 'error')
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}