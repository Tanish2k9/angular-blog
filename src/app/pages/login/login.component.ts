import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userLoginRequest, userLoginResponse } from '../../models/ApiResponse';
import { ApiLoaderComponent } from "../../shared/api-loader/api-loader.component";
import { CommonModule } from '@angular/common';
import { ToastifyService } from '../../services/toastify.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, ApiLoaderComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService:AuthServiceService = inject(AuthServiceService);
  formBuilder:FormBuilder = inject(FormBuilder);
  router:Router = inject(Router);
  toastify = inject(ToastifyService);

  isLoading=false;

  constructor(){}
  loginResponse!:userLoginResponse;

  userForm: FormGroup =this.formBuilder.group({
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  });



  onFormSubmit(){
    // console.log(this.userForm);

    
    if(this.userForm.valid){
      this.isLoading = true;
      let obj:userLoginRequest={
        email:this.userForm.value.email,
        password:this.userForm.value.password
      }
      this.authService.login(obj).subscribe({
        next:(res)=>{
          this.isLoading = false;
          this.loginResponse = res.data;
          this.router.navigate(["/"]);
          this.toastify.showSuccess("Login successfully","Success");
        },
        error:(err)=>{
          console.log("Failled to login",err);
          this.isLoading = false;
          this.toastify.showError(err?.error?.errors?.[0],"Error")
        }
      })
    }else{
      console.log("invalid login form");
    }
  }

}
