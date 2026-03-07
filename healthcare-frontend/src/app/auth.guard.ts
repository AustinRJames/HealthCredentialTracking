import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Api } from './services/api'

export const authGuard: CanActivateFn = (route, state) => {
    // Inject tools
    const api = inject(Api);
    const router = inject(Router);

    // Check token
    if (api.isLoggedInSignal()) {
        return true; // Let them through
    } else {
        // Kick to login screen if not verified
        router.navigate(['/login']);
        return false;
    }
}