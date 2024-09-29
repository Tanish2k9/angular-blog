import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { Category } from '../models/CategoryModel';
// import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor() { }
  http:HttpClient = inject(HttpClient);
  baseUrl= environment.apiUrl;
  private getHeaders(): HttpHeaders {
    let token = localStorage.getItem("token");
    if(token){
      token = JSON.parse(token);
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
  }

  getAllCategories():Observable<ApiResponse<Category[]>>{
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}category`);
  }
  getCategory(id:Number):Observable<ApiResponse<Category>>{
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}category/${id}`, { headers: this.getHeaders() });
  }
  addCategory(data:any):Observable<ApiResponse<Category>>{
    return this.http.post<ApiResponse<Category>>(`${this.baseUrl}category`,data, { headers: this.getHeaders() });
  }
  updateCategory(id:Number,data:any):Observable<ApiResponse<Category>>{
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}category/${id}`,data, { headers: this.getHeaders() });
  }
  deleteCategory(id:Number):Observable<ApiResponse<String>>{
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}category/${id}`, { headers: this.getHeaders() });
  }
}
