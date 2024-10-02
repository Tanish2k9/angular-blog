import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/PostModel';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from "../../shared/custom-pagination/custom-pagination.component";
import { PaginationResponse } from '../../models/ApiResponse';
import { ToastifyService } from '../../services/toastify.service';
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, CustomPaginationComponent, PageLoaderComponent, ApiLoaderComponent],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.css'
})
export class MyPostComponent implements OnInit {

  postService:PostService = inject(PostService);
  toastify:ToastifyService = inject(ToastifyService);
  myBlogs?:Post[];
  isLoadingCount=0;

  ApiLoading = {
    deleteApi:0
  }
  private  setIsLoading(data:boolean,count =1){
    if(data === true){
      this.isLoadingCount = this.isLoadingCount +count;
    }else if((data === false) && (this.isLoadingCount >0)){
      this.isLoadingCount = this.isLoadingCount -count;
    }
  }


  pageNumber=0;
  pageSize= 10;
  lastPage:boolean = false;
  totalElements=0;
  totalPages = 1;


  ngOnInit(): void {
    this.setIsLoading(true,1);
    this.getMyBlogs();
  }

  onPageChanged(data:number){

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
        this.setIsLoading(false);
      },
      error:(err)=>{
        this.setIsLoading(false);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }

  onDelete(postId:number){
    this.ApiLoading.deleteApi = postId;
    this.postService.deletePost(postId.toString()).subscribe({
      next:(res)=>{
      
        this.toastify.showSuccess(res.message,"SUCCESS");
        this.pageNumber = 0;
        this.getMyBlogs();
        this.ApiLoading.deleteApi = 0;
      },
      error:(err)=>{
        this.ApiLoading.deleteApi = 0;
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }

}
