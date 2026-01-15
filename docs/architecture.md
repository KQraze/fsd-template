# FSD Architecture

Feature-Sliced Design (FSD) — методология проектирования фронтенд-приложений, которая помогает структурировать код по бизнес-логике и слоям ответственности.

## Основные принципы FSD

### 1. Слоистая архитектура

Код организован в слои, расположенные от нижнего к верхнему. Верхние слои могут импортировать из нижних, но не наоборот.

```
┌─────────────────────────────────────┐
│  app/     — Инициализация          │  ↑ Верхний слой
├─────────────────────────────────────┤  │
│  pages/   — Страницы приложения    │  │
├─────────────────────────────────────┤  │
│  widgets/ — Композитные блоки UI   │  │ Направление
├─────────────────────────────────────┤  │ зависимостей
│  features/— Пользовательские       │  │ (импортов)
│             сценарии               │  │
├─────────────────────────────────────┤  │
│  entities/— Бизнес-сущности        │  │
├─────────────────────────────────────┤  │
│  shared/  — Переиспользуемый код   │  ↓ Нижний слой
└─────────────────────────────────────┘
```

### 2. Public API

Каждый слой и слайс экспортирует функционал только через файл `index.ts`. Это создает четкую границу между внутренней реализацией и публичным интерфейсом.

```typescript
// ✅ Правильно
import { useProfile } from '@/entities/account'

// ❌ Неправильно
import { useProfile } from '@/entities/account/queries/account.queries'
```

### 3. Изоляция

Слайсы на одном уровне **не знают** друг о друге и не могут импортировать напрямую.

```typescript
// ❌ Нельзя: features/auth-form импортирует из features/todo-create
import { TodoCreate } from '@/features/todo-create'
```

## Слои (Layers)

### 1. shared/ — Переиспользуемый код

**Цель**: Общий код без привязки к бизнес-логике проекта.

**Когда использовать**:
- UI компоненты общего назначения (кнопки, инпуты)
- Утилиты (форматирование, валидация)
- Настройки API (axios instance)
- Общие типы TypeScript

**Структура**:
```
shared/
├── api/              # HTTP клиент
│   ├── instance.ts   # Axios instance с interceptors
│   ├── consts.ts     # ApiStatus enum
│   ├── types.ts      # ApiResponse, ApiError
│   └── index.ts
├── ui/               # UI библиотека
│   ├── button/
│   │   ├── AppButton.vue
│   │   ├── button.variants.ts
│   │   └── index.ts
│   ├── input/
│   └── index.ts
├── lib/              # Утилиты и хелперы
│   ├── router/       # Настройка роутера
│   │   ├── routes.ts
│   │   └── index.ts
│   ├── format-date.ts
│   └── index.ts
├── composables/      # Vue composables
│   ├── use-auth.ts
│   └── index.ts
├── types/            # Общие TS типы
│   └── index.ts
└── index.ts          # Public API
```

**Примеры**:
```typescript
// shared/api/instance.ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// shared/ui/button/AppButton.vue
// Универсальная кнопка, не знает о бизнес-логике

// shared/lib/format-date.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU').format(date)
}

// shared/composables/use-auth.ts
export function useAuth() {
  const isAuth = computed(() => !!localStorage.getItem('token'))
  return { isAuth }
}
```

**Правила**:
- ❌ Не импортирует из верхних слоев
- ❌ Не знает о бизнес-логике (пользователи, товары, заказы)
- ✅ Может быть переиспользован в любом проекте

---

### 2. entities/ — Бизнес-сущности

**Цель**: Управление данными и состоянием бизнес-сущностей.

**Когда создавать entity**:
- Есть данные с бэкенда (users, products, orders)
- Нужно управлять состоянием (получить, создать, обновить, удалить)
- Сущность используется в разных частях приложения

**Структура entity**:
```
entities/account/
├── model/                    # Публичное API слайса
│   └── index.ts              # Реэкспорт queries и composables
├── services/                 # API запросы
│   ├── account.service.ts    # { login, profile, logout }
│   └── index.ts
├── queries/                  # Pinia Colada
│   ├── account.keys.ts       # ACCOUNT_QUERY_KEYS
│   ├── account.queries.ts    # useProfile, useLogin
│   └── index.ts
├── types/                    # TypeScript типы
│   ├── account.types.ts      # Account, LoginBody
│   └── index.ts
└── index.ts                  # Public API entity
```

**Примеры**:

```typescript
// entities/account/types/account.types.ts
export interface Account {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  account: Account
}
```

```typescript
// entities/account/services/account.service.ts
import { api } from '@/shared/api'
import type { Account, LoginBody, LoginResponse } from '../types/account.types'

export const accountService = {
  login: (data: LoginBody) =>
    api.post<LoginResponse>('auth/login', data).then(res => res.data),

  profile: () =>
    api.get<Account>('auth/profile').then(res => res.data),

  logout: () =>
    api.post('auth/logout'),
}
```

```typescript
// entities/account/queries/account.keys.ts
export const ACCOUNT_QUERY_KEYS = {
  root: ['account'] as const,
  profile: () => [...ACCOUNT_QUERY_KEYS.root, 'profile'] as const,
}
```

```typescript
// entities/account/queries/account.queries.ts
import { defineQuery, useQuery, defineMutation, useMutation } from '@pinia/colada'
import { accountService } from '../services'
import { ACCOUNT_QUERY_KEYS } from './account.keys'

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

  return useMutation({
    mutation: accountService.login,
    onSuccess(data) {
      setToken(data.token)
      queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.root })
    },
  })
})
```

```typescript
// entities/account/index.ts — Public API
export * from './model'
export * from './services'
export type * from './types/account.types'
```

**Использование**:
```vue
<script setup lang="ts">
import { useProfile, useLogin, type Account } from '@/entities/account'

const { data: profile, isLoading } = useProfile()
const { mutateAsync: login } = useLogin()
</script>
```

**Правила**:
- ✅ Импортирует из `shared/`
- ❌ Не импортирует из `features/`, `widgets/`, `pages/`, `app/`
- ❌ Не импортирует из других entities (entities/account → entities/todos ❌)
- ✅ Один entity = одна бизнес-сущность

---

### 3. features/ — Пользовательские сценарии

**Цель**: Реализация действий, которые может выполнить пользователь.

**Когда создавать feature**:
- Пользователь совершает действие (войти, добавить в корзину, создать задачу)
- Есть UI для этого действия (форма, кнопка, модалка)
- Логика не подходит для entity (это не данные, а процесс)

**Структура feature**:
```
features/auth-form/
├── ui/
│   └── AuthForm.vue          # Форма входа
├── model/
│   └── use-auth-form.ts      # Логика формы (опционально)
└── index.ts
```

**Примеры**:

```vue
<!-- features/auth-form/ui/AuthForm.vue -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { AppInput, AppButton } from '@/shared/ui'
import { useLogin } from '@/entities/account' // ← импорт из entities

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
  })
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { mutateAsync: login, isPending } = useLogin()

const onSubmit = handleSubmit(async (values) => {
  await login(values)
})
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <app-input
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      placeholder="Email"
      :error="!!errors.email"
    />
    <app-input
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      placeholder="Пароль"
      :error="!!errors.password"
    />
    <app-button type="submit" :disabled="isPending" full-width>
      Войти
    </app-button>
  </form>
</template>
```

```typescript
// features/auth-form/index.ts
export { default as AuthForm } from './ui/AuthForm.vue'
```

**Отличие от entities**:
- **Entity** — данные и их состояние (пользователь, заказы)
- **Feature** — процесс, действие пользователя (войти, создать заказ)

**Правила**:
- ✅ Импортирует из `entities/` и `shared/`
- ❌ Не импортирует из `widgets/`, `pages/`, `app/`
- ❌ Не импортирует из других features

---

### 4. widgets/ — Композитные блоки

**Цель**: Крупные самостоятельные блоки UI, собранные из features и entities.

**Когда создавать widget**:
- Блок использует несколько features/entities
- Блок переиспользуется на разных страницах
- Блок слишком большой для feature (>150-200 строк)

**Структура widget**:
```
widgets/header/
├── ui/
│   └── AppHeader.vue
├── model/                 # Опционально
│   └── use-header.ts
└── index.ts
```

**Примеры**:

```vue
<!-- widgets/header/ui/AppHeader.vue -->
<script setup lang="ts">
import { AppButton, AppIcon } from '@/shared/ui'
import { useProfile } from '@/entities/account' // ← из entities
import { useRouter } from 'vue-router'

const { data: profile } = useProfile()
const router = useRouter()
</script>

<template>
  <header class="border-b bg-white">
    <div class="container mx-auto flex items-center justify-between py-4">
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-xl font-bold">
          Logo
        </router-link>
        <nav class="flex gap-4">
          <router-link to="/">Главная</router-link>
          <router-link to="/about">О нас</router-link>
        </nav>
      </div>

      <div v-if="profile" class="flex items-center gap-4">
        <span>{{ profile.firstName }}</span>
        <app-button variant="ghost" size="sm">
          <app-icon name="user" :size="20" />
        </app-button>
      </div>
      <div v-else>
        <app-button @click="router.push('/login')">
          Войти
        </app-button>
      </div>
    </div>
  </header>
</template>
```

```typescript
// widgets/header/index.ts
export { default as AppHeader } from './ui/AppHeader.vue'
```

**Правила**:
- ✅ Импортирует из `features/`, `entities/`, `shared/`
- ❌ Не импортирует из `pages/`, `app/`
- ❌ Не импортирует из других widgets

---

### 5. pages/ — Страницы приложения

**Цель**: Композиция всех слоев в готовые страницы.

**Структура**:
```
pages/
├── home/
│   └── HomePage.vue      # БЕЗ index.ts!
├── login/
│   └── LoginPage.vue
└── profile/
    └── ProfilePage.vue
```

**Особенность**: у pages **НЕТ** Public API (`index.ts`), чтобы работал lazy loading в роутере.

**Пример**:

```vue
<!-- pages/login/LoginPage.vue -->
<script setup lang="ts">
import { DefaultLayout } from '@/app/layouts'
import { AuthForm } from '@/features/auth-form'
</script>

<template>
  <default-layout>
    <div class="flex min-h-screen items-center justify-center">
      <div class="w-full max-w-md">
        <h1 class="mb-6 text-2xl font-bold">Вход</h1>
        <auth-form />
      </div>
    </div>
  </default-layout>
</template>
```

```vue
<!-- pages/home/HomePage.vue -->
<script setup lang="ts">
import { DefaultLayout } from '@/app/layouts'
import { AppHeader } from '@/widgets/header'
import { useTodos } from '@/entities/todos'

const { data: todos, isLoading } = useTodos()
</script>

<template>
  <default-layout>
    <app-header />
    <main class="container mx-auto py-8">
      <h1>Главная страница</h1>
      <div v-if="isLoading">Загрузка...</div>
      <div v-else>
        <!-- Контент -->
      </div>
    </main>
  </default-layout>
</template>
```

**Роутинг**:
```typescript
// shared/lib/router/routes.ts
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'), // lazy loading
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
  },
]
```

**Правила**:
- ✅ Импортирует из всех слоев ниже
- ❌ Не имеет `index.ts` (для lazy loading)
- ❌ Не импортирует из других pages
- ✅ Только композиция, минимум логики

---

### 6. app/ — Инициализация приложения

**Цель**: Настройка и запуск приложения.

**Что здесь**:
- Точка входа (`main.ts`)
- Корневой компонент (`App.vue`)
- Роутер
- Провайдеры (Pinia, Pinia Colada)
- Глобальные layouts

**Структура**:
```
app/
├── App.vue                  # Корневой компонент
├── main.ts                  # Точка входа
├── router/
│   └── index.ts             # Настройка Vue Router
├── providers/
│   └── index.ts             # Pinia, PiniaColada
└── layouts/
    ├── DefaultLayout.vue    # Базовый layout
    ├── AuthLayout.vue       # Layout для auth страниц
    └── index.ts
```

**Примеры**:

```typescript
// app/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import App from './App.vue'
import { router } from './router'
import '@/assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PiniaColada)
app.use(router)

app.mount('#app')
```

```vue
<!-- app/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view />
</template>
```

```vue
<!-- app/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import { AppHeader } from '@/widgets/header'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <app-header />
    <main>
      <slot />
    </main>
  </div>
</template>
```

**Правила**:
- ✅ Импортирует из всех слоев
- ✅ Единственный слой, который может импортировать напрямую из `pages/`
- ✅ Глобальная конфигурация

---

## Правила импортов

### Матрица зависимостей

| Слой     | shared | entities | features | widgets | pages | app |
|----------|--------|----------|----------|---------|-------|-----|
| shared   | ❌     | ❌       | ❌       | ❌      | ❌    | ❌  |
| entities | ✅     | ❌       | ❌       | ❌      | ❌    | ❌  |
| features | ✅     | ✅       | ❌       | ❌      | ❌    | ❌  |
| widgets  | ✅     | ✅       | ✅       | ❌      | ❌    | ❌  |
| pages    | ✅     | ✅       | ✅       | ✅      | ❌    | ❌  |
| app      | ✅     | ✅       | ✅       | ✅      | ✅    | ❌  |

### Примеры

```typescript
// ✅ Правильные импорты
// В features можно импортировать из entities и shared
import { useProfile } from '@/entities/account'
import { AppButton } from '@/shared/ui'

// В widgets можно импортировать из features, entities, shared
import { AuthForm } from '@/features/auth-form'
import { useProfile } from '@/entities/account'

// В pages можно импортировать из всех слоев ниже
import { AppHeader } from '@/widgets/header'
import { AuthForm } from '@/features/auth-form'

// ❌ Неправильные импорты
// В entities нельзя импортировать из features
import { AuthForm } from '@/features/auth-form' // ❌

// В features нельзя импортировать из widgets
import { AppHeader } from '@/widgets/header' // ❌

// Обход internal файлов
import { useProfile } from '@/entities/account/queries/account.queries' // ❌
// Правильно:
import { useProfile } from '@/entities/account' // ✅
```

## Public API

Каждый слой/слайс экспортирует функционал только через `index.ts`:

```typescript
// entities/account/index.ts
export * from './model'
export * from './services'
export type * from './types/account.types'

// features/auth-form/index.ts
export { default as AuthForm } from './ui/AuthForm.vue'

// widgets/header/index.ts
export { default as AppHeader } from './ui/AppHeader.vue'

// shared/ui/index.ts
export * from './button'
export * from './input'
export * from './icon'

// shared/index.ts
export * from './ui'
export * from './api'
export * from './lib'
export * from './composables'
```

**Использование**:
```typescript
// ✅ Через Public API
import { AppButton, AppInput } from '@/shared/ui'
import { useProfile } from '@/entities/account'

// ❌ Напрямую (обход Public API)
import AppButton from '@/shared/ui/button/AppButton.vue'
import { useProfile } from '@/entities/account/queries/account.queries'
```

## Преимущества FSD

1. **Предсказуемость** — всегда понятно, куда класть новый код
2. **Масштабируемость** — легко добавлять новые features и entities
3. **Переиспользуемость** — shared слой можно переносить между проектами
4. **Изоляция** — изменения в одном слое не ломают другие
5. **Онбординг** — новые разработчики быстро разбираются в структуре

## Дополнительные материалы

- [Официальная документация FSD](https://feature-sliced.design/ru/)
- [FSD Best Practices](https://feature-sliced.design/ru/docs/guides/examples)
- [getting-started.md](./getting-started.md) — руководство для начинающих
- [project-structure.md](./project-structure.md) — визуальная схема проекта