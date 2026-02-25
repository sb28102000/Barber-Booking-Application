import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Barber {
  id: number;
  name: string;
  specialty: string;
  basePrice: number;
  mobileNumber: string; // <--- NEW: Barber's Mobile
}

interface Appointment {
  id: number;
  barberId: number;
  customerName: string;
  status: string;
  appointmentTime: string;
  purpose: string;
  price: number;
  customerMobile: string; // <--- NEW: User's Mobile
}

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
          <div class="card shadow-sm h-100">
            <div class="card-body text-center">
              <h5 class="card-title">{{ barber.name }}</h5>
              <p class="card-text text-muted">{{ barber.specialty }}</p>
              
              <h6 class="text-primary fw-bold mb-3">
                <span *ngIf="barber.basePrice">Starts at \${{ barber.basePrice }}</span>
                <span *ngIf="!barber.basePrice">Price: Varies</span>
              </h6>

              <button class="btn btn-success w-100" (click)="selectBarber(barber)">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow p-4 bg-light">
        <h3 class="mb-3">📅 My Appointments</h3>
        <ul class="list-group">
          <li *ngFor="let appt of appointments" class="list-group-item d-flex justify-content-between">
            <div>
              <strong>#{{ appt.id }} - {{ appt.purpose || 'General Visit' }}</strong>
              <br>
              <small class="text-muted">Price: \${{ appt.price }}</small>
            </div>
            <div>
              <span class="badge bg-primary ms-2">{{ appt.status }}</span>
              <br>
              <small>{{ appt.appointmentTime | date:'short' }}</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class BookingComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  cdr = inject(ChangeDetectorRef);
  
  barbers: Barber[] = [];
  appointments: Appointment[] = [];
  currentUserName: string = 'Guest';

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserName = this.extractUserFromToken();
      if (this.currentUserName === 'Guest') {
        this.logout();
      } else {
        this.fetchBarbers();
        this.fetchAppointments();
      }
    }
  }

  fetchBarbers() {
     this.http.get<Barber[]>('http://127.0.0.1:8081/api/v1/booking/barbers')
       .subscribe(data => { this.barbers = data; this.cdr.detectChanges(); });
  }

  fetchAppointments() {
     this.http.get<Appointment[]>('http://127.0.0.1:8081/api/v1/booking/appointments')
       .subscribe(data => { this.appointments = data; this.cdr.detectChanges(); });
  }

  // --- UPDATED BOOKING LOGIC WITH MOBILE ---
  async selectBarber(barber: Barber) {
    // 1. Popup that asks for Service Type AND Mobile Number
    const { value: formValues } = await Swal.fire({
      title: `Book ${barber.name}`,
      html: `
        <p class="text-muted small"><strong>Shop Contact:</strong> ${barber.mobileNumber || 'Not Listed'}</p>
        <hr>
        <label class="mb-1">Select Service:</label>
        <select id="swal-purpose" class="swal2-input mb-3">
          <option value="Haircut">Haircut</option>
          <option value="Beard Trim">Beard Trim</option>
          <option value="Full Service">Full Service (Hair + Beard)</option>
          <option value="Consultation">Consultation</option>
        </select>
        
        <label class="mb-1">Your Mobile Number:</label>
        <input id="swal-mobile" type="tel" class="swal2-input" placeholder="+1 234 567 890">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Booking',
      preConfirm: () => {
        return [
          (document.getElementById('swal-purpose') as HTMLInputElement).value,
          (document.getElementById('swal-mobile') as HTMLInputElement).value
        ]
      }
    });

    if (formValues) {
      const [purpose, mobile] = formValues;
      
      // Simple Validation
      if (!mobile) {
        Swal.fire('Error', 'Mobile number is required for the barber to contact you!', 'error');
        return;
      }

      this.processBooking(barber, purpose, mobile);
    }
  }

  processBooking(barber: Barber, purpose: string, customerMobile: string) {
    const newAppt = { 
      barberId: barber.id, 
      customerName: this.currentUserName, 
      status: 'PENDING',
      purpose: purpose,
      price: barber.basePrice,
      customerMobile: customerMobile // <--- Sending Mobile to Backend
    };

    this.http.post('http://127.0.0.1:8081/api/v1/booking/book', newAppt)
      .subscribe({
        next: (res) => {
          Swal.fire('Request Sent!', 'Barber will review your request.', 'success');
          this.fetchAppointments();
        },
        error: (err) => {
          const msg = err.error && err.error.message ? err.error.message : 'Something went wrong';
          Swal.fire('Booking Failed', msg, 'error');
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  extractUserFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'Guest';
    try { return JSON.parse(atob(token.split('.')[1])).sub; } catch (e) { return 'Guest'; }
  }
}