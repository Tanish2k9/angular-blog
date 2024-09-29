import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { userregister } from '../../models/ApiResponse';
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, ApiLoaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  authService:AuthServiceService = inject(AuthServiceService);
  formBuilder:FormBuilder = inject(FormBuilder);
  router:Router = inject(Router);
  toastify = inject(ToastifyService);

  constructor(){}
  userForm: FormGroup =this.formBuilder.group({
    email: new FormControl('',[Validators.required]),
    username: new FormControl ('',[Validators.required, Validators.minLength(5)]),
    password: new FormControl('',[Validators.required, Validators.minLength(5)])
  });


  isLoading=false;
  
  onFormSubmit(){
    if(this.userForm.valid){
      this.isLoading = true;
      let obj: userregister ={
        username:this.userForm.value.username as string,
        email:this.userForm.value.email as string,
        password:this.userForm.value.password as string
      }
      
      this.authService.signup(obj).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          this.router.navigate(["/login"])
          this.toastify.showSuccess("Account created successfully","Success");
        },
        error:(err)=>{
          this.isLoading = false;
          this.toastify.showError(err.error.errors[0],"Error",);
        }
      });
    }else{
      console.log("invalid form");
    }
    // console.log(this.userForm);
    // console.log(this.userForm.value);
    
  }

}
