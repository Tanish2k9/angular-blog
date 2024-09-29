import { Category } from "./CategoryModel"
import { UserModel } from "./UserModel"

export interface Post {
    id: number
    title: string
    content: string
    imageUrl: string
    likeCount: number
    viewCount: number
    createdBy: UserModel
    category: Category
    createdDate: string
    lastModifiedDate: string
    liked: boolean
  }
  
  
  