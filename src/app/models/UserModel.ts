export interface UserModel {
    id: number
    username: string
    email: string
    password: string
    role: string
    likedPosts: any[]
    createdDate: string
    lastModifiedDate: any
}