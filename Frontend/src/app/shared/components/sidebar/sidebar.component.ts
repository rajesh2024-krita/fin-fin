
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav class="space-y-2">
        <a routerLink="/dashboard" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/societies" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Societies</span>
        </a>
        
        <a routerLink="/users" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Users</span>
        </a>
        
        <a routerLink="/members" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Members</span>
        </a>
        
        <a routerLink="/loans" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Loans</span>
        </a>
        
        <a routerLink="/vouchers" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Vouchers</span>
        </a>
        
        <a routerLink="/monthly-demand" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Monthly Demand</span>
        </a>
        
        <a routerLink="/reports" 
           routerLinkActive="bg-gray-700"
           class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          <span>Reports</span>
        </a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {}
