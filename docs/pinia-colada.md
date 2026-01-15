# Pinia Colada

Библиотека для управления асинхронным состоянием (data fetching) в Vue.

## Установка

```typescript
// app/main.ts
import { PiniaColada } from '@pinia/colada'

app.use(pinia)
app.use(PiniaColada)
```

## Query Keys

Ключи для кеширования. Всегда выносятся в отдельный файл.

```typescript
// entities/account/queries/account.keys.ts
export const ACCOUNT_QUERY_KEYS = {
  root: ['account'] as const,
  profile: () => [...ACCOUNT_QUERY_KEYS.root, 'profile'] as const,
  byId: (id: number) => [...ACCOUNT_QUERY_KEYS.root, id] as const,
}
```

### Иерархия ключей

```typescript
// Инвалидация всех account запросов
queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.root })
// Очищает: ['account'], ['account', 'profile'], ['account', 123]

// Инвалидация только profile
queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.profile() })
// Очищает: ['account', 'profile']
```

## defineQuery

Создание реактивного query.

```typescript
// entities/account/queries/account.queries.ts
import { defineQuery, useQuery } from '@pinia/colada'
import { useAuth } from '@/shared/composables'
import { accountService } from '../api'
import { ACCOUNT_QUERY_KEYS } from './account.keys'

export const useProfile = defineQuery(() => {
  const { isAuth } = useAuth()

  return useQuery({
    key: ACCOUNT_QUERY_KEYS.profile,
    query: accountService.profile,
    enabled: () => isAuth.value, // Условное выполнение
  })
})
```

### Использование в компоненте

```vue
<script setup lang="ts">
import { useProfile } from '@/entities/account'

const { data: profile, isLoading, error } = useProfile()
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else-if="error">Ошибка: {{ error.message }}</div>
  <div v-else>{{ profile?.firstName }}</div>
</template>
```

## defineMutation

Создание mutation для изменения данных.

```typescript
import { defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables'
import { accountService } from '../api'
import { ACCOUNT_QUERY_KEYS } from './account.keys'

export const useLogin = defineMutation(() => {
  const { setToken } = useAuth()
  const queryCache = useQueryCache()
  const router = useRouter()

  return useMutation({
    mutation: accountService.login,
    onSuccess(data) {
      setToken(data.token)
      // Инвалидация кеша после логина
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.root })
      router.push('/')
    },
    onError(error) {
      console.error('Login failed:', error)
    },
  })
})
```

### Использование mutation

```vue
<script setup lang="ts">
import { useLogin } from '@/entities/account'

const { mutateAsync: login, isPending, error } = useLogin()

async function handleSubmit(values: { email: string; password: string }) {
  await login(values)
}
</script>
```

## Query с параметрами

```typescript
export const USERS_QUERY_KEYS = {
  root: ['users'] as const,
  list: (params: UserParams) => [...USERS_QUERY_KEYS.root, 'list', params] as const,
  byId: (id: number) => [...USERS_QUERY_KEYS.root, id] as const,
}

export const useUsers = defineQuery(() => {
  const search = ref('')

  return useQuery({
    // Ключ пересчитывается при изменении search
    key: () => USERS_QUERY_KEYS.list({ search: search.value }),
    query: () => userService.getUsers({ search: search.value }),
  })
})
```

## Структура файлов

```
entities/account/
├── queries/
│   ├── account.keys.ts      # ACCOUNT_QUERY_KEYS
│   ├── account.queries.ts   # useProfile, useLogin, useLogout
│   └── index.ts             # Public API
├── api/
│   ├── account.service.ts   # API методы
│   └── index.ts
└── model/
    └── index.ts             # Реэкспорт из queries
```

## Документация

- [Queries](https://pinia-colada.esm.dev/guide/queries.html)
- [Mutations](https://pinia-colada.esm.dev/guide/mutations.html)
- [Query Keys](https://pinia-colada.esm.dev/guide/query-keys.html)
