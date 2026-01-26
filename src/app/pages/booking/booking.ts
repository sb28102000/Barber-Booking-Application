// src/app/pages/booking/booking.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="booking-container">
      <h2>Book Appointment</h2>
      
      <div class="barber-list">
        <div *ngFor="let barber of barbers" class="card">
          <h3>{{ barber.name }}</h3>
          <button (click)="bookAppointment(barber.id)">Book Now</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-container { padding: 20px; }
    .card { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
  `]
})
export class BookingComponent {
  http = inject(HttpClient);
  authService = inject(AuthService);
  
  barbers: any[] = [
    { id: 1, name: 'John Doe - Master Barber' },
    { id: 2, name: 'Jane Smith - Stylist' }
  ]; // Later fetch this from backend

  bookAppointment(barberId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const payload = { barberId: barberId, date: '2023-12-25' };

    this.http.post('http://localhost:8080/api/v1/bookings', payload, { headers })
      .subscribe({
        next: () => alert('Booking Confirmed!'),
        error: () => alert('Booking Failed!')
      });
  }
}