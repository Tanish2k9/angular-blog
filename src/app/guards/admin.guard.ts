import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { User } from '../models/ApiResponse';
import { ToastifyService } from '../services/toastify.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService:AuthServiceService = inject(AuthServiceService);
  const router = inject(Router);
  const toastify = inject(ToastifyService);

  let userData!:User|null;

  authService.user$.subscribe({
    next:(res)=>{
      userData = authService.getUserDetail();
    }
   })

  if(userData?.role === "ADMIN"){
    return true
  }else{
    toastify.showWarning("Access denied","Warning");
    router.navigateByUrl("/");
    return false;
  }
  
};
