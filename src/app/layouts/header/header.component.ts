import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { User } from '../../models/ApiResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  authService:AuthServiceService = inject(AuthServiceService);
  router:Router = inject(Router);
  isLoggedIn:boolean = false;
  userData:User | null = null;

  openSidebar:boolean = false;


  ngOnInit(): void {

   this.authService.isLoggedIn$.subscribe({
    next:(res)=>{
      this.isLoggedIn = this.authService.isLoggedIn();
    }
   }) 

   this.authService.user$.subscribe({
    next:(res)=>{
      this.userData = this.authService.getUserDetail();
    }
   }) 

  }

  toggleSidebar(){

    this.openSidebar = !this.openSidebar;


  }

  logout(){
    this.authService.logout();
    this.authService.isLoggedIn$.next(false);
    this.authService.user$.next(null);
    this.router.navigateByUrl("/login");
    this.openSidebar = !this.openSidebar;
  }
}
