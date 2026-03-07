import { Routes } from '@angular/router';
import { Login } from './component/login/login'
import { CredentialTrackerComponent } from './component/credential-tracker/credential-tracker';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    // Login Screen
    { path: 'login', component: Login },
    // Admin dashboard
    { 
        path: 'admin', 
        component: CredentialTrackerComponent,
        canActivate: [authGuard]
     },
    // If the blank root then go to login. If you type in gibberish will also redirect to login
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
