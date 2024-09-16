import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { PopularComponent } from './pages/popular/popular.component';
import { MostViewedComponent } from './pages/most-viewed/most-viewed.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { SingleBlogComponent } from './pages/single-blog/single-blog.component';
import { PostComponent } from './pages/post/post.component';
import { MyPostComponent } from './pages/my-post/my-post.component';
import { UpdateBlogComponent } from './pages/update-blog/update-blog.component';
import { CreateBlogComponent } from './pages/create-blog/create-blog.component';

export const routes: Routes = [
    {path:"", component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'popular',component:PopularComponent},
    {path:'most-viewed',component:MostViewedComponent},
    {path:'all-blogs',component:BlogsComponent},
    {path:'blog',component:SingleBlogComponent},
    {path:'post',component:PostComponent},
    {path:'my-posts',component:MyPostComponent},
    {path:'create-post',component:CreateBlogComponent},
    {path:'update-post',component:UpdateBlogComponent}
];
