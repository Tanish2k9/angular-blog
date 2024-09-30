import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/CategoryModel';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { ToastifyService } from '../../services/toastify.service';
import { ApiLoaderComponent } from '../../shared/api-loader/api-loader.component';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule,ApiLoaderComponent],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css'
})
export class CreateBlogComponent implements OnInit {

  http:HttpClient = inject(HttpClient);
  categoryService:CategoryService = inject(CategoryService);
  postService:PostService = inject(PostService);
  toastify:ToastifyService = inject(ToastifyService);
  router = inject(Router);
  fb:FormBuilder=inject(FormBuilder);

  isApiLoading = false;

  categories?:Category[];

  postForm:FormGroup = this.fb.group({
    title: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(200)]),
    content: new FormControl ('',[Validators.required, Validators.minLength(1000)]),
    image: new FormControl(null,[Validators.required]),
    selectedCategoryId: new FormControl("",[Validators.required])
  });


  ngOnInit(): void {
    this.getAllCategories();
  }
  
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length>0) {
      this.postForm.patchValue({
        image: input.files[0],
      });
    }
    this.postForm.get('image')?.markAsTouched;
  }
  
  getAllCategories(){
    this.isApiLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
        console.log(res);
        this.categories=res.data;
        this.isApiLoading = false;
      },
      error:(err)=>{
        console.log(err);
        this.isApiLoading = false;
        this.toastify.showError(err?.error.errors[0],"Error");
      }
    })
  }

  onSubmit() {

    // console.log(this.postForm.value);
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('title', this.postForm.value.title);
      formData.append('content', this.postForm.value.content);
      formData.append('image', this.postForm.value.image);
      formData.append('categoryId', this.postForm.value.selectedCategoryId);

      this.addPost(formData);
    }
  }

  addPost(data:FormData){
    this.isApiLoading = true;
    // data.forEach((val)=>{
    //   console.log(val);
    // })


    this.postService.createPost(data).subscribe({
      next:(res)=>{
        console.log(res.data)
        this.isApiLoading = false;
        this.postForm.reset();
        this.router.navigate(["/my-posts"]);
        this.toastify.showSuccess("blog created successfully","success");
      },
      error:(err)=>{
        console.log(err.error);
        this.isApiLoading = false;
        this.toastify.showError(err?.error.errors[0],"Error");
      }
    })
  }

}
