import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { User } from '@angular/fire/auth';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, NgbCollapseModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  public currentUser$: Observable<User | null>;
  isCollapsed: boolean = false;

  switchCollapse(): void {
    if (this.isCollapsed) {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }
  ngOnInit() {
     if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
    return; // prevent SSR / non-browser crashes
  }
    const observer = new ResizeObserver(() => {
      const width = window.innerWidth;

      if (width >= 768) {
        this.isCollapsed = false; // desktop = expanded
      } else {
        this.isCollapsed = true; // mobile = collapsed
      }
    });

    observer.observe(document.body);
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    // Optionally navigate to home after sign out
    this.router.navigate(['/home']);
  }

}
