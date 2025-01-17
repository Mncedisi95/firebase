import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {

  // Injecting the AuthService using inject()
  const authService = inject(AuthService) 

  // Injecting the Router using inject()
  const router = inject(Router)

  // Get the current user's role
  const userRole = await authService.hasRole(); 

  // Retrieve the required role from the route data
  const requiredRole = route.data?.['roles'] as string

  // Check if the user has the required role
  if(requiredRole && requiredRole.includes(userRole)){
    // Allow access if user role is permitted
    return true;
  }
  
  // Navigate to unauthorized page if user doesn't have the required role
  router.navigate(['/unauthorized'])
  return false

};
