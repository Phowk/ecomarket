import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapseModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  isCollapsed: boolean = false;
  isLoggedIn: boolean = false;
  fullName: string | null = null;
  userRole = signal<string | null>(null);

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.loggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
      if (logged) {
      this.fullName = this.authService.getFullName();
  }
    });
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        const width = window.innerWidth;
        this.isCollapsed = width < 768;
      });

      observer.observe(document.body);
    }

  }

  switchCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }


  userEmail(): string {
    // El email viene dentro del token JWT decodificado
    const token = this.authService.getToken();
    if (!token) return "";
    const decoded = this.authService['decodeToken'](token);
    return decoded?.sub?.email ?? "";
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.fullName = null;
    this.router.navigate(['/login']);
  }
}
