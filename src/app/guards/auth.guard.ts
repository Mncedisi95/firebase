import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
 
  // Injecting the AuthService using inject()
  const authService = inject(AuthService); 
  
  // Injecting the Router using inject()
  const router = inject(Router)

  // Check if the user is logged in
  if(authService.isLoggedIn()) {
    return true;
  }

  // If not logged in, navigate to the login page with optional query params
  router.navigate(['/login'])
  return false

};
