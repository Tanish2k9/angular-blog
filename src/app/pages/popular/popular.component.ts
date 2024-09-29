import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { PostService } from '../../services/post.service';
import { CustomPaginationComponent } from "../../shared/custom-pagination/custom-pagination.component";
import { Post } from '../../models/PostModel';
import { HttpClient } from '@angular/common/http';
import { PaginationResponse } from '../../models/ApiResponse';
import { ToastifyService } from '../../services/toastify.service';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [CardComponent, CustomPaginationComponent, CommonModule, PageLoaderComponent],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent implements OnInit{
  postService= inject(PostService);
  toastify = inject(ToastifyService);
  popularPosts?:Post[];

  isLoadingCount=0;

  ///pagination-start
  pageNumber=0;
  pageSize= 12;
  lastPage:boolean = false;
  totalElements=0;
  totalPages = 1;


  onPageChanged(data:number){
    console.log(data);
    this.pageNumber = data;
    this.getPopularBlogs();
  }
  assignPagination(res:PaginationResponse<any>){
    this.pageNumber = res.pageNumber;
    this.pageSize = res.pageSize;
    this.lastPage = res.last;
    this.totalElements = res.totalElements;
    this.totalPages = res.totalPages;
  }

  ///pagination end

  ngOnInit(): void {
    this.setIsLoading(true);
    this.getPopularBlogs(); 
  }

  getPopularBlogs(){
    
    this.postService.getPopularPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        this.popularPosts = res.data;
        
        this.assignPagination(res);
        this.setIsLoading(false);
      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error.errors?.[0],"Error");
        this.setIsLoading(false);
      }
    })
  }


  //others function/////
  private  setIsLoading(data:boolean,count =1){
    if(data === true){
      this.isLoadingCount = this.isLoadingCount +count;
    }else if((data === false) && (this.isLoadingCount >0)){
      this.isLoadingCount = this.isLoadingCount -count;
    }
  }
  

}
