import { Routes } from '@angular/router';
// Notice we removed '.component' from the end of the path
import { LoginComponent } from './pages/login/login'; 
import { BookingComponent } from './pages/booking/booking';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'booking', component: BookingComponent }
];