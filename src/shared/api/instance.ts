import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ApiStatus } from './consts'

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === ApiStatus.UNAUTHORIZED) {
      localStorage.removeItem('token')
    }

    return Promise.reject(error)
  },
)
