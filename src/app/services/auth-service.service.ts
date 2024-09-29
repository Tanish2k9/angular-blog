import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, User, userLoginRequest, userLoginResponse, userregister } from '../models/ApiResponse';
import { BehaviorSubject, catchError, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  http:HttpClient = inject(HttpClient);
  
  constructor() { }
  baseUrl= environment.apiUrl;
  private tokenKey = "token";
  private userProfile = "user-profile"
  user$ =  new BehaviorSubject<User|null>(null);
  // user$ = this.userSource.asObservable();
  // LoggedInUser = new Subject<User>();
  isLoggedIn$ = new BehaviorSubject<Boolean>(false);

  signup(data: userregister):Observable<ApiResponse<userregister>>{
    return this.http.post<ApiResponse<userregister>>(this.baseUrl+"auth/register",data)
  }

  login(data:userLoginRequest){
    return this.http.post<ApiResponse<userLoginResponse>>(this.baseUrl+"auth/login",data).pipe(
      map((res:ApiResponse<userLoginResponse>)=>{
        const data:userLoginResponse  = res.data;
        if(data){
          localStorage.setItem(this.tokenKey,JSON.stringify(data.token));
          this.isLoggedIn$.next(true);
          this.setUser(data.user);
        }
        return res;
      })
    )   
  }
  isLoggedIn():boolean{
    const token = this.getToken();
    if(!token) return false;

    return !this.isTokenExpired();
  }

  private isTokenExpired():boolean{
    const token = this.getToken();
    if(!token) return true;

    const decoded = jwtDecode(token);
    const tokenExpiredOrNot = Date.now() >= decoded['exp']! * 1000;
    if(tokenExpiredOrNot){
      this.logout();
    }
    return tokenExpiredOrNot;
  }
  
  logout(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userProfile)
  }

  getUserDetail():User|null{
      const data = localStorage.getItem(this.userProfile);
      if(data){
        const userDetail: User = JSON.parse(data);
        
        return userDetail;
      }
    
    return null;
  }

  public getToken(){
    return localStorage.getItem(this.tokenKey);
  }
  private setUser(user:User){
    localStorage.setItem(this.userProfile,JSON.stringify(user));
    this.user$.next(user);
  }
  // isUserLoggedIn():boolean{
  //   token: string = JSON.parse(localStorage.getItem("token"));
  //   return !!localStorage.getItem("token");
  // }


}
