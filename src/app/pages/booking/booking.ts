import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // <--- Import Router

interface Barber { id: number; name: string; specialty: string; }
interface Appointment { id: number; barberId: number; customerName: string; status: string; appointmentTime: string; }

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Choose Your Barber</h2>
        <div>
            <span class="badge bg-secondary me-2">User: {{ currentUserName }}</span>
            <button class="btn btn-danger btn-sm" (click)="logout()">Logout</button>
        </div>
      </div>

      <div class="row mb-5">
        <div *ngFor="let barber of barbers" class="col-md-4 mb-3">
          <div class="card shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">{{ barber.name }}</h5>
              <p class="card-text text-muted">{{ barber.specialty }}</p>
              <button class="btn btn-success" (click)="selectBarber(barber)">Book Appointment</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow p-4 bg-light">
        <h3 class="mb-3">📅 Appointments for {{ currentUserName }}</h3>
        <ul class="list-group">
          <li *ngFor="let appt of appointments" class="list-group-item">
            <strong>#{{ appt.id }} - {{ appt.customerName }}</strong>
            <span class="badge bg-primary ms-2">{{ appt.status }}</span>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class BookingComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router); // <--- Inject Router
  platformId = inject(PLATFORM_ID);
  cdr = inject(ChangeDetectorRef);
  
  barbers: Barber[] = [];
  appointments: Appointment[] = [];
  currentUserName: string = 'Guest';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserName = this.extractUserFromToken();
      if (this.currentUserName === 'Guest') {
        this.logout(); // Redirect if token is invalid
      } else {
        this.fetchBarbers();
        this.fetchAppointments();
      }
    }
  }

  logout() {
    localStorage.removeItem('token'); // 1. Delete Token
    this.router.navigate(['/login']); // 2. Go to Login
  }

  // ... (Keep your extractUserFromToken, fetchBarbers, fetchAppointments, selectBarber functions exactly as they were) ...
  extractUserFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'Guest';
    try { return JSON.parse(atob(token.split('.')[1])).sub; } catch (e) { return 'Guest'; }
  }

  fetchBarbers() {
     this.http.get<Barber[]>('http://127.0.0.1:8081/api/v1/booking/barbers').subscribe(data => { this.barbers = data; this.cdr.detectChanges(); });
  }
  
  fetchAppointments() {
     this.http.get<Appointment[]>('http://127.0.0.1:8081/api/v1/booking/appointments').subscribe(data => { this.appointments = data; this.cdr.detectChanges(); });
  }

  selectBarber(barber: Barber) {
    if (confirm(`Book ${barber.name}?`)) {
        const newAppt = { barberId: barber.id, customerName: this.currentUserName, status: 'PENDING' };
        this.http.post('http://127.0.0.1:8081/api/v1/booking/book', newAppt).subscribe(() => { alert('Confirmed!'); this.fetchAppointments(); });
    }
  }
}