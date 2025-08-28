import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div *ngIf="!isLoginPage" class="flex h-screen">
        <!-- Sidebar -->
        <div class="w-64 bg-white shadow-sm border-r border-gray-200">
          <app-sidebar></app-sidebar>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <app-header></app-header>
          <main class="flex-1 overflow-y-auto p-6">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>

      <!-- Login Page -->
      <div *ngIf="isLoginPage" class="min-h-screen">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isLoginPage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });

    // Check if user is authenticated
    if (!this.authService.isAuthenticated() && !this.isLoginPage) {
      this.router.navigate(['/login']);
    }
  }
}