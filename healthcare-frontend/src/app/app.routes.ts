import { Routes } from '@angular/router';
import { Login } from './component/login/login'
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard';
import { Register } from './component/register/register'
import { authGuard } from './auth.guard';

export const routes: Routes = [
    // Login Screen
    { path: 'login', component: Login },
    // Admin dashboard
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard]
     },
    // If the blank root then go to login. If you type in gibberish will also redirect to login
    { path: 'register', component: Register},

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
