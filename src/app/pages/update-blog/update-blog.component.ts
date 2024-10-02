import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/PostModel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/CategoryModel';
import { CommonModule } from '@angular/common';
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-update-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ApiLoaderComponent],
  templateUrl: './update-blog.component.html',
  styleUrl: './update-blog.component.css'
})
export class UpdateBlogComponent implements OnInit{

  postService:PostService = inject(PostService);
  categoryService:CategoryService = inject(CategoryService);
  route:ActivatedRoute = inject(ActivatedRoute);
  toastify = inject(ToastifyService);
  fb:FormBuilder = inject(FormBuilder);
  router = inject(Router);

  blog?:Post;
  categories?:Category[];
  postId!:String;
  isApiLoading = false;

  updateForm:FormGroup = this.fb.group({
    title: new FormControl( "",[Validators.required,Validators.minLength(3),Validators.maxLength(200)]),
    content: new FormControl ('',[Validators.required, Validators.minLength(1000)]),
    image: new FormControl(null),
    selectedCategoryId: new FormControl( "",[Validators.required])
  });

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get("id")!;
    this.getBlog();
    this.getAllCategories();
  }

  getBlog(){
    this.postService.getPost(this.postId).subscribe({
      next:(res)=>{
        this.updateForm.patchValue({
          title: res.data.title,
          content: res.data.content,
          selectedCategoryId:res.data.category.id,
          // Add other fields as necessary
        });
      },
      error:(err)=>{
  
        this.toastify.showError(err?.error.errors[0],"Error");
      }
    });
  }
  getAllCategories(){
    this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
  
        this.categories=res.data;
      },
      error:(err)=>{
   
        this.toastify.showError(err?.error.errors[0],"Error");
      }
    })
  }
  updatePost(data:FormData){
    this.isApiLoading = true;
    this.postService.updatePost(this.postId,data).subscribe({
      next:(res)=>{
       
        this.isApiLoading = false;
        this.updateForm.reset();
        this.router.navigate(["/my-posts"]);
        this.toastify.showSuccess("Post update successfully","Success");
      },
      error:(err)=>{
      
        this.isApiLoading = false;
        this.toastify.showError(err?.error.errors[0],"Error");
        
      }
    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.updateForm.patchValue({
        image: file,
      });
    }
  }

  
  onSubmit() {
    if (this.updateForm.valid) {
      const formData = new FormData();
      formData.append('title', this.updateForm.value.title);
      formData.append('content', this.updateForm.value.content);
      if(this.updateForm.value.image){
       formData.append('image', this.updateForm.value.image);
      }
      formData.append('categoryId', this.updateForm.value.selectedCategoryId);
      this.updatePost(formData);
    }
  }

}
