import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User, CreateUserDto } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Users</h1>
          <p class="mt-2 text-gray-600">Manage system users and their permissions</p>
        </div>

        <!-- Add User Form -->
        <div class="bg-white shadow rounded-lg mb-6" *ngIf="showAddForm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Add New User</h3>
          </div>
          <div class="p-6">
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="username"
                    formControlName="username"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    formControlName="password"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    formControlName="role"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="">Select Role</option>
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="SocietyAdmin">Society Admin</option>
                    <option value="User">User</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label for="edpNo" class="block text-sm font-medium text-gray-700">EDP No</label>
                  <input
                    type="text"
                    id="edpNo"
                    formControlName="edpNo"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Enter EDP number"
                  />
                </div>
              </div>
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  (click)="cancelAdd()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="userForm.invalid || loading"
                  class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ loading ? 'Creating...' : 'Create User' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- User List -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">User List</h3>
              <button
                (click)="toggleAddForm()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {{ showAddForm ? 'Cancel' : 'Add User' }}
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="user.isActive ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="users.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">No users found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showAddForm = false;
  loading = false;
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      edpNo: ['']
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.userForm.reset();
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const userData: CreateUserDto = this.userForm.value;

      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.users.push(user);
          this.userForm.reset();
          this.showAddForm = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.loading = false;
        }
      });
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.userForm.reset();
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}