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

@Component({
  selector: 'app-single-blog',
  standalone: true,
  imports: [CardComponent,CommonModule,FormsModule],
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
  pageSize = 1;
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

    this.getBlogData(this.postId);
    this.getSimilarBlogs(this.postId)
    this.getBlogComments();
   
  }
  onLoad(){
    this.getBlogData(this.postId);
    this.getSimilarBlogs(this.postId)
    this.getBlogComments();
  }

  getBlogData(id:String){
    this.postService.getPost(id).subscribe({
      next:(res)=>{
        this.blogData = res.data;
        this.liked = res.data.liked;
        this.likeCount = res.data.likeCount;
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }

  getSimilarBlogs(id:String){
    this.postService.getSimilarPosts(id).subscribe({
      next:(res)=>{
        this.similarBlog = res.data;
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
      }
    })
  }


  getBlogComments(){
    this.commentService.getPostComments(this.postId,this.pageNummber,this.pageSize).subscribe({
      next:(res)=>{
        this.assignPagination(res);
        this.comments = res.data;
      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
      }
    })
  }

  addComment(){
    let data = {
      "content":this.addCommentField
    }
    this.commentService.addComment(this.postId,data).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
      }
    })
  }

  updateComment(id:Number){
    let data = {
      "content":this.editCommentField
    }
    this.commentService.updateComment(this.postId,id.toString(),data).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
        this.onCancel();

      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
      }
    })
  }


  onDelete(id:Number){
    
    this.commentService.deleteComment(this.postId,id.toString()).subscribe({
      next:(res)=>{
        this.getBlogComments();
        this.addCommentField="";
        this.onCancel();

      },
      error:(err)=>{
        console.log(err);
        this.toastify.showError(err?.error?.errors?.[0],"ERROR");
      }
    })
  }



  loadMore(){
    this.pageSize = this.pageSize+1;
    this.getBlogComments();
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
    this.postService.updatePostLikes(id).subscribe({
      next:(res)=>{
        this.liked = res.data;
        if(this.liked){
          this.likeCount++;
        }else{
          this.likeCount--;
        }
      },
      error:(err)=>{
        this.toastify.showError(err?.error?.errors?.[0],"ERROR")
      }
    })
  }



}
