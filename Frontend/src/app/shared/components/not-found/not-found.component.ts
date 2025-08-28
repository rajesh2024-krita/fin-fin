
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 class="mt-6 text-6xl font-bold text-gray-900">404</h2>
          <p class="mt-2 text-sm text-gray-600">Page not found</p>
        </div>
        <div>
          <p class="text-gray-500">The page you're looking for doesn't exist.</p>
          <div class="mt-6">
            <a routerLink="/dashboard" 
               class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Go back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
