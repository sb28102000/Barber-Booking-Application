import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>👑 Admin Dashboard</h2>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>

      <div class="card shadow">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">All Appointments</h5>
        </div>
        <div class="card-body p-0">
          <table class="table table-striped mb-0">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Barber ID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let appt of appointments">
                <td>{{ appt.id }}</td>
                <td><strong>{{ appt.customerName }}</strong></td>
                <td>{{ appt.barberId }}</td>
                <td><span class="badge bg-success">{{ appt.status }}</span></td>
                <td>{{ appt.appointmentTime | date:'short' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteAppointment(appt.id)">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="appointments.length === 0" class="p-3 text-center text-muted">
            No active appointments found.
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  appointments: any[] = [];

  ngOnInit() {
    this.loadAllAppointments();
  }

  loadAllAppointments() {
    this.http.get<any[]>('http://127.0.0.1:8081/api/v1/booking/appointments')
      .subscribe({
        next: (data) => {
          this.appointments = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading admin data', err)
      });
  }

  deleteAppointment(id: number) {
    if(confirm('Are you sure you want to cancel this booking?')) {
      this.http.delete(`http://127.0.0.1:8081/api/v1/booking/appointment/${id}`, { responseType: 'text' })
        .subscribe({
          next: (res) => {
            alert(res);
            this.loadAllAppointments(); // Refresh the list
          },
          error: (err) => alert('Error deleting')
        });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}