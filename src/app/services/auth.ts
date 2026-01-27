import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  // MAKE SURE THIS URL MATCHES YOUR BACKEND
  private apiUrl = 'http://localhost:8080/api/v1/auth'; 

  login(credentials: any) {
    // We expect the backend to return an object with an accessToken string
    return this.http.post<{accessToken: string}>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}