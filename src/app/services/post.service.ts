import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse, PaginationResponse } from '../models/ApiResponse';
import { Post } from '../models/PostModel';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  http:HttpClient = inject(HttpClient);
  constructor() { }

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
  private getMultipartHeaders(): HttpHeaders {
    let token = localStorage.getItem("token");
    if(token){
      token = JSON.parse(token);
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  createPost(data:FormData):Observable<ApiResponse<Post>>{
    return this.http.post<ApiResponse<Post>>(`${this.baseUrl}post`, data,{ headers: this.getMultipartHeaders() })
  }
  updatePost(id:String,data:FormData):Observable<ApiResponse<Post>>{
    return this.http.put<ApiResponse<Post>>(`${this.baseUrl}post/${id}`, data,{ headers: this.getHeaders() })
  }
  updatePostLikes(id:String):Observable<ApiResponse<boolean>>{
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}post/${id}/like`,{ headers: this.getHeaders() })
  }
  deletePost(id:String):Observable<ApiResponse<String>>{
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}post/${id}`, { headers: this.getHeaders() })
  }
  getAllPosts(pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Post[]>>{
    return this.http.get<PaginationResponse<Post[]>>(`${this.baseUrl}all-posts?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  getPopularPosts(pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Post[]>>{
    return this.http.get<PaginationResponse<Post[]>>(`${this.baseUrl}popular-post?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }


  getMostViewedPosts(pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Post[]>>{
    return this.http.get<PaginationResponse<Post[]>>(`${this.baseUrl}most-viewed-post?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }


  getMyPosts(pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Post[]>>{
    return this.http.get<PaginationResponse<Post[]>>(`${this.baseUrl}my-posts?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers: this.getHeaders() })
  }

  getPost(id:String):Observable<ApiResponse<Post>>{
    return this.http.get<ApiResponse<Post>>(`${this.baseUrl}post/${id}`, { headers: this.getHeaders() })
  }
  
  getSearchPost(search:String,categoryId:String|null,pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Post[]>>{
    return this.http.get<PaginationResponse<Post[]>>(`${this.baseUrl}searchPost?search=${search}&categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }
  getSimilarPosts(id:String):Observable<ApiResponse<Post[]>>{
    return this.http.get<ApiResponse<Post[]>>(`${this.baseUrl}post/${id}/similar`, { headers: this.getHeaders() })
  }
  


}
