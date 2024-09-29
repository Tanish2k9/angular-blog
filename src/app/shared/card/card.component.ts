import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../models/PostModel';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/CommentModel';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  router:Router = inject(Router)
  authService = inject(AuthServiceService);
  isLoggedIn:boolean = false;
  
  @Input() blogData?: Post;

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next:(res)=>{
        this.isLoggedIn = this.authService.isLoggedIn();
      }
     }) 
  }

  


  navigateToPage(id:number):void{
    // console.log("chala")
    // if(this.isLoggedIn){
      this.router.navigate(["/blog",id])
    // }else{
    //   this.router.navigate(["login"])
    // }

    
  }

  


}
