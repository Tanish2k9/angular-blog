import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/PostModel';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, NgxSpinnerModule, PageLoaderComponent, ApiLoaderComponent,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  http= inject(HttpClient);
  postService:PostService = inject(PostService);
  spinner = inject(NgxSpinnerService);
  allBlogs?:Post[];
  popularBlogs?:Post[];
  mostViewedBlogs?:Post[];

  isLoadingCount=0;

  pageNumber:Number=0;
  pageSize:Number=3;

  ngOnInit(): void {
    this.getAllBlogs();
    this.getPopularBlogs();
    this.getMostViewedBlogs();
  }

  getAllBlogs(){
    this.spinner.show();
    this.isLoadingCount++;
    this.postService.getAllPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        console.log(res);
        this.allBlogs=res.data;
        this.spinner.hide();
        this.isLoadingCount--;
      },
      error:(err)=>{
        console.log(err);

        this.isLoadingCount--;
      }
    })
  }
  getPopularBlogs(){
    this.spinner.show();
    this.isLoadingCount++;
    this.postService.getPopularPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        console.log(res);
        this.popularBlogs=res.data;
        this.spinner.hide();
        this.isLoadingCount--;
        
      },
      error:(err)=>{
        console.log(err);
        this.isLoadingCount--;
      }
    })
  }
  getMostViewedBlogs(){
    this.isLoadingCount++;
    this.postService.getMostViewedPosts(this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{
        console.log(res);
        this.mostViewedBlogs=res.data;
       this.isLoadingCount--;
        
      },
      error:(err)=>{
        console.log(err);
        this.isLoadingCount--;
      }
    })
  }
}
