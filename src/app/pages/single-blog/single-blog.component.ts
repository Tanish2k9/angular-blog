import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/card/card.component";
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/CommentModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationResponse, User } from '../../models/ApiResponse';
import { AuthServiceService } from '../../services/auth-service.service';
import { Post } from '../../models/PostModel';
import { PostService } from '../../services/post.service';
import { ToastifyService } from '../../services/toastify.service';
import { identity } from 'rxjs';
import { PageLoaderComponent } from "../../shared/page-loader/page-loader.component";
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CardComponent, CommonModule, FormsModule, PageLoaderComponent, ApiLoaderComponent],
  templateUrl: './single-blog.component.html',
  styleUrl: './single-blog.component.css'
})
export class SingleBlogComponent implements OnInit {
  route:ActivatedRoute = inject(ActivatedRoute);
  commentService:CommentService = inject(CommentService);
  authService:AuthServiceService = inject(AuthServiceService);
  postService:PostService =inject(PostService);
  toastify:ToastifyService = inject(ToastifyService);
  activatedRoute = inject(ActivatedRoute);

  isLoadingCount=0;
  isApiLoading = {
    add:false,
    update:-1,
    delete:-1,
    like:false,
    loadMore:false
  };

  addCommentField:String="";
  editCommentField:String="";
  editCommentId:Number|null = null;
  postId!:String
  comments?:Comment[];
  userData!:User|null;
  blogData?:Post;
  similarBlog?:Post[];
  liked:boolean=false;
  likeCount=0;


  //------------------------Pagination  for comments---------//

  pageNummber=0;
  pageSize = 10;
  lastPage:boolean = false;
  totalElements=0;
  totalPages = 1;

  assignPagination(res:PaginationResponse<Comment[]>){
    this.pageNummber = res.pageNumber;
    this.pageSize = res.pageSize;
    this.lastPage = res.last;
    this.totalElements = res.totalElements;
    this.totalPages = res.totalPages;
  }

  // -------------------pagination--------------------- //


  ngOnInit(): void {
    // this.postId = this.route.snapshot.paramMap.get("id")!;
    this.activatedRoute.params.subscribe((params =>{
       this.postId = params['id'];
        this.onLoad();

    }))
    this.authService.user$.subscribe({
      next:(res)=>{
        this.userData = this.authService.getUserDetail();
      }
     })
  }

  onLoad(){
    this.setIsLoading(true,3);
    this.getBlogData(this.postId);
    this.getSimilarBlogs(this.postId)
    this.getBlogComments();
  }
  private  setIsLoading(data:boolean,count =1){
    if(data === true){
      this.isLoadingCount = this.isLoadingCount +count;
    }else if((data === false) && (this.isLoadingCount >0)){
      this.isLoadingCount = this.isLoadingCount -count;
    }
  }

  getBlogData(id:String){
   
    this.postService.getPost(id).subscribe({
      next:(res)=>{
        this.blogData = res.data;
        this.liked = res.data.liked;
        this.likeCount = res.data.likeCount;
        this.setIsLoading(false);
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.setIsLoading(false);
      }
    })
  }

  getSimilarBlogs(id:String){
  
    this.postService.getSimilarPosts(id).subscribe({
      next:(res)=>{
        this.similarBlog = res.data;
        this.setIsLoading(false);
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.setIsLoading(false);
      }
    })
  }


  getBlogComments(){
    this.commentService.getPostComments(this.postId,this.pageNummber,this.pageSize).subscribe({
      next:(res)=>{
        this.assignPagination(res);
        this.comments = res.data;
        this.setIsLoading(false);
      },
      error:(err)=>{
      
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.setIsLoading(false);
      }
    })
  }

  addComment(){
    let data = {
      "content":this.addCommentField
    }
    this.isApiLoading.add = true;
    this.commentService.addComment(this.postId,data).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
        this.isApiLoading.add = false;
      },
      error:(err)=>{
       
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.isApiLoading.add = false;
      }
    })
  }

  updateComment(id:number){
    let data = {
      "content":this.editCommentField
    }
    this.isApiLoading.update = id;
    this.commentService.updateComment(this.postId,id.toString(),data).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
        this.onCancel();
        this.isApiLoading.update= -1;

      },
      error:(err)=>{
    
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.isApiLoading.update = -1;
      }
    })
  }


  onDelete(id:number){
    this.isApiLoading.delete = id;
    this.commentService.deleteComment(this.postId,id.toString()).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
        this.onCancel();
        this.isApiLoading.delete = -1;
      },
      error:(err)=>{
       
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
        this.isApiLoading.delete = -1;
      }
    })
  }



  loadMore(){
    this.isApiLoading.loadMore = true;
    this.pageSize = this.pageSize+1;
    this.getBlogComments();
    this.isApiLoading.loadMore = false;
  }

  onEdit(id:Number,editData:String){
    this.editCommentId = id;
    this.editCommentField= editData;

  }
  onCancel(){
    this.editCommentId = null;
    this.editCommentField="";
  }

  onLike(id:any){
    this.isApiLoading.like = true;
    this.postService.updatePostLikes(id).subscribe({
      next:(res)=>{
        this.liked = res.data;
        if(this.liked){
          this.likeCount++;
        }else{
          this.likeCount--;
        }
        this.isApiLoading.like = false;
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
        this.isApiLoading.like = false;
      }
    })
  }



}
