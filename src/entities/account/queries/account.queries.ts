import {
  defineQuery,
  defineMutation,
  useQuery,
  useMutation,
  useQueryCache,
} from '@pinia/colada'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables'
import { Routes } from '@/shared/lib'
import { accountService, ACCOUNT_QUERY_KEYS } from '@/entities'

export const useProfile = defineQuery(() => {
  const { isAuth } = useAuth()

  return useQuery({
    key: ACCOUNT_QUERY_KEYS.profile,
    query: accountService.profile,
    enabled: () => isAuth.value,
  })
})

export const useLogin = defineMutation(() => {
  const { setToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: accountService.login,
    onSuccess(data) {
      setToken(data.token)
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all })
      router.push(Routes.home)
    },
  })
})

export const useRegister = defineMutation(() => {
  const { setToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: accountService.register,
    onSuccess(data) {
      setToken(data.token)
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all })
      router.push(Routes.home)
    },
  })
})

export const useLogout = defineMutation(() => {
  const { clearToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: accountService.logout,
    onSuccess() {
      clearToken()
      queryCache.setQueryData(ACCOUNT_QUERY_KEYS.profile(), undefined)
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all })
      router.push(Routes.login)
    },
  })
})

export const useUpdateProfile = defineMutation(() => {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: accountService.updateProfile,
    onSuccess() {
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.profile() })
    },
  })
})
