import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/PostModel';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from "../../shared/custom-pagination/custom-pagination.component";
import { PaginationResponse } from '../../models/ApiResponse';
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, CustomPaginationComponent],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.css'
})
export class MyPostComponent implements OnInit {

  postService:PostService = inject(PostService);
  toastify:ToastifyService = inject(ToastifyService);
  myBlogs?:Post[];

  pageNumber=0;
  pageSize= 10;
  lastPage:boolean = false;
  totalElements=0;
  totalPages = 1;

  ngOnInit(): void {
    this.getMyBlogs();
  }

  onPageChanged(data:number){
    console.log(data);
    this.pageNumber = data;
    this.getMyBlogs();
  }
  assignPagination(res:PaginationResponse<any>){
    this.pageNumber = res.pageNumber;
    this.pageSize = res.pageSize;
    this.lastPage = res.last;
    this.totalElements = res.totalElements;
    this.totalPages = res.totalPages;
  }

  getMyBlogs(){
    this.postService.getMyPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        this.myBlogs= res.data;
        this.assignPagination(res);
      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }

  onDelete(postId:Number){
    this.postService.deletePost(postId.toString()).subscribe({
      next:(res)=>{
        console.log(res);
        this.toastify.showSuccess(res.message,"SUCCESS");
        this.pageNumber = 0;

        this.getMyBlogs();
      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }

}
