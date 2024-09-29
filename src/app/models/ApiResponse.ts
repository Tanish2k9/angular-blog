export interface ApiResponse<T>{
    status:Number,
    message:string,
    data:T
}
export interface PaginationResponse<T> {
    statusCode: number
    message: string
    pageNumber: number
    pageSize: number
    totalElements: number
    totalPages: number
    data: T
    last: boolean
  }
export interface User {
    id: string
    email: string
    username: string
    role: string
}
export interface userregister{
    email: string,
    username: string,
    password: string
}
export interface userLoginRequest{
    email: string,
    password: string
}
export interface userLoginResponse{
    token: string
    expirationTime: string
    user: User
}

  
