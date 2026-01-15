import { computed, ref } from 'vue'

const token = ref<string>(localStorage.getItem('token') ?? '')

export function useAuth() {
  const isAuth = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

  return {
    token,
    isAuth,
    setToken,
    clearToken,
  }
}
