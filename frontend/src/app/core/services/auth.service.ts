import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  isAuthenticated = signal<boolean>(this.hasToken())

  login(email: string, password: string): boolean{
    if (email === 'admin@banco.com' && password === '123456') {
      const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.falso-payload.falsa-assinatura';
      if (this.isBrowser) localStorage.setItem('token', fakeJwt);
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  private hasToken(): boolean {
    return this.isBrowser && !!localStorage.getItem('token');
  }
}
