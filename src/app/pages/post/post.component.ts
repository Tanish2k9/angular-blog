import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/ApiResponse';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  authService = inject(AuthServiceService);

  userData:User | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next:(res)=>{
        this.userData = this.authService.getUserDetail();
      }
    })
  }


}
