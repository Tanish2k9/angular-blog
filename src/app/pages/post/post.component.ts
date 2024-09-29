import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  authService = inject(AuthServiceService);

  isAdmin:boolean = false;

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next:(res)=>{
        if(res?.role === "ADMIN"){
          this.isAdmin = true;
        }
      }
    })
  }


}
