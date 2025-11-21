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

  isCollapsed = false;

  // Signals para UI reactiva
  loggedIn = signal(false);
  userRole = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        const width = window.innerWidth;
        this.isCollapsed = width < 768; 
      });

      observer.observe(document.body);
    }

    this.refreshAuthState();
  }

  switchCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  private refreshAuthState() {
    this.loggedIn.set(this.authService.isLoggedIn());
    this.userRole.set(this.authService.getRole());
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
    this.refreshAuthState();
    this.router.navigate(['/login']);
  }
}
