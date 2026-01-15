import { api } from '@/shared/api'
import type { Account, LoginBody, LoginResponse, RegisterBody } from '@/entities'

export const accountService = {
  login: (data: LoginBody) =>
    api.post<LoginResponse>('auth/login', data).then((res) => res.data),

  register: (data: RegisterBody) =>
    api.post<LoginResponse>('auth/register', data).then((res) => res.data),

  profile: () =>
    api.get<Account>('auth/profile').then((res) => res.data),

  logout: () =>
    api.post('auth/logout'),

  updateProfile: (data: Partial<Account>) =>
    api.patch<Account>('auth/profile', data).then((res) => res.data),
}
