import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { ToastifyService } from '../services/toastify.service';

export const authGuard: CanActivateFn = (route, state) => {
 
  const authService  = inject(AuthServiceService);
  const router = inject(Router);
  const toastify = inject(ToastifyService);
  let isLoggedIn!:boolean;

  authService.isLoggedIn$.subscribe({
    next:(res)=>{
      isLoggedIn = authService.isLoggedIn();
    }
  })

  if(isLoggedIn){
    return true;

  }else{
    toastify.showInfo("Please login first","Info");
    router.navigateByUrl("/login")
    return false;
  }

  
  
};
