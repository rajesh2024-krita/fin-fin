
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'societies',
    loadComponent: () => import('./features/societies/societies.component').then(c => c.SocietiesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then(c => c.UsersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'members',
    loadComponent: () => import('./features/members/members.component').then(c => c.MembersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'loans',
    loadComponent: () => import('./features/loans/loans.component').then(c => c.LoansComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'vouchers',
    loadComponent: () => import('./features/vouchers/vouchers.component').then(c => c.VouchersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'monthly-demand',
    loadComponent: () => import('./features/monthly-demand/monthly-demand.component').then(c => c.MonthlyDemandComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SuperAdmin', 'SocietyAdmin'] }
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(c => c.ReportsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
