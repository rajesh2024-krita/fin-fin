
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">Fintcs</h1>
        </div>
        
        <nav class="hidden md:flex items-center space-x-6">
          <a routerLink="/dashboard" class="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
          <a routerLink="/societies" class="text-gray-700 hover:text-blue-600 font-medium">Societies</a>
          <a routerLink="/users" class="text-gray-700 hover:text-blue-600 font-medium">Users</a>
          <a routerLink="/members" class="text-gray-700 hover:text-blue-600 font-medium">Members</a>
          <a routerLink="/loans" class="text-gray-700 hover:text-blue-600 font-medium">Loans</a>
          <a routerLink="/vouchers" class="text-gray-700 hover:text-blue-600 font-medium">Vouchers</a>
          <a routerLink="/reports" class="text-gray-700 hover:text-blue-600 font-medium">Reports</a>
        </nav>

        <div class="flex items-center space-x-4">
          <button (click)="logout()" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
