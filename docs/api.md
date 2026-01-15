# API Layer

Работа с HTTP запросами через Axios.

## Axios Instance

```typescript
// shared/api/instance.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ApiStatus } from './consts'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor - добавление токена
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === ApiStatus.UNAUTHORIZED) {
      localStorage.removeItem('token')
      // Можно добавить редирект на логин
    }
    return Promise.reject(error)
  },
)
```

## API Status Codes

```typescript
// shared/api/consts.ts
export enum ApiStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  SERVER_ERROR = 500,
}
```

## Типы ответов

```typescript
// shared/api/types.ts
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
}
```

## Service Layer

Сервисы создаются в entities:

```typescript
// entities/account/api/account.service.ts
import { api } from '@/shared/api'
import type { Account, LoginBody, LoginResponse } from '../types/account.types'

export const accountService = {
  login: (data: LoginBody) =>
    api.post<LoginResponse>('auth/login', data).then((res) => res.data),

  profile: () =>
    api.get<Account>('auth/profile').then((res) => res.data),

  logout: () =>
    api.post('auth/logout'),

  updateProfile: (data: Partial<Account>) =>
    api.patch<Account>('auth/profile', data).then((res) => res.data),
}
```

## Использование с Pinia Colada

```typescript
// entities/account/queries/account.queries.ts
import { defineQuery, useQuery } from '@pinia/colada'
import { accountService } from '../api'
import { ACCOUNT_QUERY_KEYS } from './account.keys'

export const useProfile = defineQuery(() => {
  return useQuery({
    key: ACCOUNT_QUERY_KEYS.profile,
    query: accountService.profile,
  })
})
```

## Переменные окружения

```bash
# .env
VITE_API_URL=https://api.example.com

# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.production.com
```

## Структура

```
shared/api/
├── instance.ts   # Axios instance
├── consts.ts     # ApiStatus enum
├── types.ts      # TypeScript типы
└── index.ts      # Public API

entities/account/
├── api/
│   ├── account.service.ts
│   └── index.ts
└── queries/
    ├── account.keys.ts
    ├── account.queries.ts
    └── index.ts
```
