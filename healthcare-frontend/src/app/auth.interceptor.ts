import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Api } from './services/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Inject api service to access local storage methods
    const api = inject(Api);
    const token = api.getToken();

    // Clone request if we have token
    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        // Send modified request to C#
        return next(clonedRequest);
    }

    // If no token just send normal request
    return next(req);

}
