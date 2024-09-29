import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../models/CommentModel';
import { ApiResponse, PaginationResponse } from '../models/ApiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

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

  getPostComments(id:String,pageNumber:Number,pageSize:Number):Observable<PaginationResponse<Comment[]>>{
    return this.http.get<PaginationResponse<Comment[]>>(`${this.baseUrl}post/${id}/comment?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers: this.getHeaders() });
  }
  addComment(id:String,data:any):Observable<ApiResponse<Comment>>{
    return this.http.post<ApiResponse<Comment>>(`${this.baseUrl}post/${id}/comment`,data, { headers: this.getHeaders() });
  }
  deleteComment(postId:String,commentId:String):Observable<ApiResponse<String>>{
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}post/${postId}/comment/${commentId}`, { headers: this.getHeaders() });
  }
  updateComment(postId:String,commentId:String,data:any):Observable<ApiResponse<Comment>>{
    return this.http.put<ApiResponse<Comment>>(`${this.baseUrl}post/${postId}/comment/${commentId}`, data,{ headers: this.getHeaders() });
  }
}
