import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";
import { CustomPaginationComponent } from '../../shared/custom-pagination/custom-pagination.component';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { ToastifyService } from '../../services/toastify.service';
import { Post } from '../../models/PostModel';
import { PaginationResponse } from '../../models/ApiResponse';

@Component({
  selector: 'app-most-viewed',
  standalone: true,
  imports: [CardComponent,CustomPaginationComponent, CommonModule,  PageLoaderComponent],
  templateUrl: './most-viewed.component.html',
  styleUrl: './most-viewed.component.css'
})
export class MostViewedComponent implements OnInit {
  postService= inject(PostService);
  toastify = inject(ToastifyService);
  mostViewedPosts?:Post[];


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
    this.getMostViewedBlogs();
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
    this.getMostViewedBlogs(); 
  }

  getMostViewedBlogs(){
    
    this.postService.getMostViewedPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        this.mostViewedPosts = res.data;
        
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
