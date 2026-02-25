import { Routes } from '@angular/router';
// Notice we removed '.component' from the end of the path
import { LoginComponent } from './pages/login/login'; 
import { BookingComponent } from './pages/booking/booking';
import { SignupComponent } from './pages/signup/signup';
import { AdminComponent } from './pages/admin/admin';
import { BarberPortalComponent } from './pages/login/pages/barber-portal/barber-portal';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'booking', component: BookingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'barber-portal', component: BarberPortalComponent },
];