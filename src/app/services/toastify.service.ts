import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastifyService {

  constructor(public toastr: ToastrService ) {}

  showSuccess(title:string,message:string){
    this.toastr.success(title,message, {
      timeOut: 3000,
    });
   }

   showError(title:string,message:string){
    this.toastr.error(title,message, {
   timeOut: 3000,
 });
   }
    showInfo(title:string,message:string){
    this.toastr.info(title,message, {
   timeOut: 3000,
 });
   }
    showWarning(title:string,message:string){
    this.toastr.warning(title,message, {
   timeOut: 3000,
 });
   }
}
