import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/CategoryModel';
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  categoryService:CategoryService = inject(CategoryService);
  toastify:ToastifyService = inject(ToastifyService);
  @ViewChild('inputField') inputField!: ElementRef;


  categories?:Category[];
  categoryEdit:boolean = false;
  categoryEditId:Number|null=null;
  categoryTitle:String = "";


  ngOnInit(): void {
    this.getAllCategories();
  }
  getAllCategories(){
    this.categoryService.getAllCategories().subscribe({
      next:(res)=>{
        console.log(res);
        this.categories=res.data;
      },
      error:(err)=>{
        // console.log(err);
        this.toastify.showError("Error",err);
      }
    })
  }
  
  onAdd(){
    let data = {
      "title":this.categoryTitle
    }
    this.categoryService.addCategory(data).subscribe({
      next:(res)=>{
        this.categoryTitle="";
        this.getAllCategories();
        this.toastify.showSuccess("Category added successfully","Success");
      },
      error:(err)=>{
        // console.log(err);
        this.toastify.showError( err?.error?.errors?.[0],"Error");
      }
    })
  }
  onEdit(id:Number){
    this.categoryEdit= true;
    this.categoryEditId=id;

    this.categoryService.getCategory(id).subscribe({
      next:(res)=>{
        this.categoryTitle = res.data.title;
        this.inputField.nativeElement.focus(); 
      },
      error:(err)=>{
        // console.log(err);
        this.toastify.showError("Error",err);
      }
    })
  }
  onUpdate(){
    let data = {
      "title":this.categoryTitle
    }
    this.categoryService.updateCategory(this.categoryEditId!,data).subscribe({
      next:(res)=>{
        this.categoryTitle="";
        this.getAllCategories();
        this.categoryEdit=false;
        this.categoryTitle="";
        this.categoryEditId=null;
        this.toastify.showSuccess("Category updated successfully","Success");
      },
      error:(err)=>{
        // console.log(err);
        this.toastify.showError( err?.error?.errors?.[0],"Error");
      }
    })
  }
  onDelete(id:Number){
    this.categoryService.deleteCategory(id).subscribe({
      next:(res)=>{
        this.getAllCategories();
        this.onCancel();
        this.toastify.showSuccess("Category deleted successfully","Success");
      },
      error:(err)=>{
        // console.log(err);
        
        this.toastify.showError( err?.error?.errors?.[0],"Error");
      }
    })
  }
  onCancel(){
    this.categoryEdit=false;
    this.categoryEditId=null;
    this.categoryTitle = "";
  }


}
