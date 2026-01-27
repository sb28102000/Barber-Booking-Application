import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], 
  templateUrl: './app.html', 
  styleUrl: './app.css'
})
// We renamed this from 'AppComponent' to 'App' to match your main.ts file
export class App {
  title = 'barber-booking-ui';
}