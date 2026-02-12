import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');

  if (role) {
    // L'utilisateur est connecté (Admin ou Secretaire)
    return true;
  } else {
    // Non connecté : redirection forcée
    router.navigate(['/login']);
    return false;
  }
};