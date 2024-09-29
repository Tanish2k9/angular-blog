import { UserModel } from "./UserModel" 
export interface Comment {
    id: number
    content: string
    user: UserModel
}