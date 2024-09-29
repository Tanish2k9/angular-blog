import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/CategoryModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/PostModel';
import { CustomPaginationComponent } from "../../shared/custom-pagination/custom-pagination.component";
import { PaginationResponse } from '../../models/ApiResponse';
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";
import { ApiLoaderComponent } from '../../shared/api-loader/api-loader.component';
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CardComponent, CommonModule, FormsModule, CustomPaginationComponent, PageLoaderComponent,ApiLoaderComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit {

  postService:PostService = inject(PostService);
  categoryService:CategoryService = inject(CategoryService);
  toastify = inject(ToastifyService);


  selectedCategoryId:String="";
  categories?:Category[];
  searchField:String="";
  allSearchedBlogs?:Post[];
  isLoadingCount=0;
  isApiLoading = false;


  pageNumber=0;
  pageSize = 12;
  lastPage:boolean = false;
  totalElements=0;
  totalPages = 1;


  ngOnInit(): void {
    this.setIsLoading(true,2);
    this.getAllCategories();
    this.getBlogsBySearch("","");
  }

  
  onPageChanged(data:number){
    console.log(data);
    this.pageNumber = data;
    this.getBlogsBySearch(this.searchField,this.selectedCategoryId);
  }
  assignPagination(res:PaginationResponse<any>){
    this.pageNumber = res.pageNumber;
    this.pageSize = res.pageSize;
    this.lastPage = res.last;
    this.totalElements = res.totalElements;
    this.totalPages = res.totalPages;
  }

  getBlogsBySearch( search:String,categoryId:String){

    this.isApiLoading = true;
    this.postService.getSearchPost(search,categoryId,this.pageNumber,this.pageSize).subscribe({
      next:(res)=>{

        this.allSearchedBlogs = res.data;
        this.setIsLoading(false);
        this.assignPagination(res);
        this.isApiLoading = false;
      },
      error:(err)=>{
        console.log(err);
        this.setIsLoading(false);
        this.toastify.showError(err?.error?.errors?.[0],"Error")
        this.isApiLoading = false;
      }
    })
  }

  getAllCategories(){
    this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
        this.setIsLoading(false);
        this.categories = res.data;
      },
      error:(err)=>{
        this.setIsLoading(false);
        console.log(err);
      }
    })
  }
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Type the event
    this.selectedCategoryId = selectElement.value.toString()!; // Get the selected value
    // console.log(this.selectedCategoryId,"------->")
    this.getBlogsBySearch(this.searchField,this.selectedCategoryId)
  }
  onSend(){
    this.pageNumber = 0;
    this.getBlogsBySearch(this.searchField,this.selectedCategoryId);
    
  }

  private  setIsLoading(data:boolean,count =1){
    if(data === true){
      this.isLoadingCount = this.isLoadingCount +count;
    }else if((data === false) && (this.isLoadingCount >0)){
      this.isLoadingCount = this.isLoadingCount -count;
    }
  }


}
