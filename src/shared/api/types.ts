export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  // добавить данные с пагинации
}

export interface PaginationParams {
  page?: number
  limit?: number
}
