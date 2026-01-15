# Руководство для начинающих

## Что такое FSD?

FSD — это способ организации кода, где каждая часть приложения находится на своем "слое" и в своем "слайсе". Код структурирован по уровням абстракции и бизнес-логики:

```
┌─────────────────────────────────────┐
│  app/     — инициализация и роутинг │  ← Верхний слой
├─────────────────────────────────────┤
│  pages/   — страницы приложения     │
├─────────────────────────────────────┤
│  widgets/ — композитные блоки UI    │
├─────────────────────────────────────┤
│  features/— действия пользователя   │
├─────────────────────────────────────┤
│  entities/— бизнес-сущности         │
├─────────────────────────────────────┤
│  shared/  — переиспользуемый код    │  ← Нижний слой
└─────────────────────────────────────┘
```

**Главное правило**: Верхние слои могут использовать нижние, но не наоборот.

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск dev сервера

```bash
npm run dev
```

Приложение откроется на http://localhost:5173/

### 3. Структура проекта

```
src/
├── app/          # Инициализация приложения (router, providers, layouts)
├── pages/        # Страницы приложения (HomePage, LoginPage)
├── widgets/      # Крупные блоки UI (AppHeader, AppFooter)
├── features/     # Пользовательские действия (auth-form, todo-create)
├── entities/     # Бизнес-сущности (account, todos, products)
└── shared/       # Общий код (ui компоненты, api, утилиты)
```

## Понимание слоев

### shared/ — Общий код

Здесь живет код, который **НЕ знает** о вашем бизнесе. Это как набор инструментов на кухне: нож, сковородка, миксер. Они универсальные и подходят для любого блюда.

**Что здесь?**
- `ui/` — UI компоненты (кнопки, инпуты, иконки)
- `api/` — настройка axios, типы API
- `lib/` — утилиты (форматирование дат, валидация)
- `composables/` — переиспользуемые Vue composables

**Пример**: кнопка `AppButton` не знает, для чего ее будут использовать — для входа, отправки формы или удаления. Она просто кнопка.

```typescript
// ✅ Правильно — общий UI компонент
shared/ui/button/AppButton.vue

// ❌ Неправильно — знает о бизнес-логике
shared/ui/button/LoginButton.vue
```

### entities/ — Бизнес-сущности

Это "ингредиенты" вашего приложения — пользователи, товары, заказы. Каждая сущность знает, как себя получить, обновить или удалить.

**Структура entity**:
```
entities/account/
├── model/        # Публичное API (queries, composables)
├── api/          # API запросы (accountService.login)
├── queries/      # Pinia Colada (useProfile, useLogin)
├── types/        # TypeScript типы (Account, LoginBody)
└── index.ts      # Экспорт наружу
```

**Когда создавать entity?**
- У вас есть данные с бэкенда (пользователи, товары)
- Нужно управлять состоянием этих данных
- Данные используются в разных частях приложения

**Пример**: entity `account` знает о пользователе — как залогиниться, получить профиль, выйти.

```typescript
// Использование
import { useProfile, useLogin } from '@/entities/account'

const { data: profile, isLoading } = useProfile()
const { mutateAsync: login } = useLogin()
```

### features/ — Пользовательские сценарии

Это "действия", которые может совершить пользователь. Обычно это форма + логика отправки.

**Примеры features**:
- `auth-form/` — форма входа/регистрации
- `todo-create/` — создание новой задачи
- `product-add-to-cart/` — добавление товара в корзину

**Структура feature**:
```
features/auth-form/
├── ui/
│   └── AuthForm.vue    # Форма с полями и валидацией
├── lib/
│   └── validation.ts   # Схемы валидации (Zod)
├── model/
│   └── index.ts        # Логика (если нужна)
└── index.ts
```

**Отличие от entities**: feature — это **процесс** (войти в систему), entity — это **данные** (пользователь).

### widgets/ — Композитные блоки

Это "начинки" из features и entities. Большие блоки UI, которые используют несколько слоев ниже.

**Примеры widgets**:
- `AppHeader` — шапка сайта (логотип, меню, профиль пользователя)
- `ProductCard` — карточка товара (изображение, цена, кнопка "в корзину")
- `TodoList` — список задач с фильтрами

**Когда создавать widget?**
- Блок использует несколько features или entities
- Блок слишком большой для feature
- Блок переиспользуется на разных страницах

### pages/ — Страницы

Это готовые страницы приложения. Страница собирает widgets, features и entities в единое целое.

**Особенность**: у страниц **НЕТ** файла `index.ts` (Public API), чтобы работал lazy loading в роутере.

```
pages/
├── home/
│   └── HomePage.vue       # Без index.ts!
└── login/
    └── LoginPage.vue
```

### app/ — Инициализация

Здесь живет код, который запускает ваше приложение: роутер, настройка Pinia, layouts.

```
app/
├── App.vue              # Корневой компонент
├── main.ts              # Точка входа
├── router/              # Vue Router настройка
├── providers/           # Провайдеры (Pinia, Pinia Colada)
└── layouts/             # Лейауты (DefaultLayout, AuthLayout)
```

## Правила импортов

### Public API

Каждый слой экспортирует только через `index.ts`. Это как "витрина магазина" — снаружи видно только то, что разрешено.

```typescript
// ✅ Правильно
import { AppButton } from '@/shared/ui'
import { useProfile } from '@/entities/account'

// ❌ Неправильно — импорт внутренних файлов
import { AppButton } from '@/shared/ui/button/AppButton.vue'
import { useProfile } from '@/entities/account/queries/account.queries'
```

### Направление импортов

```typescript
// ✅ Правильно — импорт из нижних слоев
// В features можно импортировать из entities и shared
import { useProfile } from '@/entities/account'
import { AppButton } from '@/shared/ui'

// ❌ Неправильно — импорт из верхних слоев
// В entities НЕЛЬЗЯ импортировать из features
import { AuthForm } from '@/features/auth-form'
```

**Визуально**:
```
app ↓
pages ↓
widgets ↓
features ↓
entities ↓
shared (никуда не импортирует из слоев выше)
```

## С чего начать разработку?

### Сценарий 1: Добавить новую страницу

1. Создайте страницу в `pages/`:
```vue
<!-- pages/about/AboutPage.vue -->
<script setup lang="ts"></script>

<template>
    <h1>О нас</h1>
</template>
```

2. Добавьте роут в `shared/lib/router/routes.ts`:
```typescript
{
  path: Routes.about,
  name: 'about',
  component: () => import('@/pages/about/AboutPage.vue')
}
```

### Сценарий 2: Создать новый UI компонент

1. Создайте папку в `shared/ui/`:
```
shared/ui/card/
├── AppCard.vue
├── card.variants.ts
└── index.ts
```

2. Опишите стили в `card.variants.ts`:
```typescript
import { tv, type VariantProps } from 'tailwind-variants'

export const cardVariants = tv({
  base: 'rounded-lg border bg-white p-4',
  variants: {
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
})

export type CardVariants = VariantProps<typeof cardVariants>
```

3. Создайте компонент `AppCard.vue`:
```vue
<script setup lang="ts">
import { cardVariants, type CardVariants } from './card.variants'

interface Props {
  shadow?: CardVariants['shadow']
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'md',
})
</script>

<template>
  <div :class="cardVariants({ shadow: props.shadow })">
    <slot />
  </div>
</template>
```

4. Экспортируйте в `index.ts`:
```typescript
export { default as AppCard } from './AppCard.vue'
export { cardVariants, type CardVariants } from './card.variants'
```

5. Добавьте в `shared/ui/index.ts`:
```typescript
export * from './card'
```

### Сценарий 3: Работа с API (новая entity)

1. Создайте типы в `entities/todos/types/todos.types.ts`:
```typescript
export interface Todo {
  id: number
  title: string
  completed: boolean
}

export interface CreateTodoBody {
  title: string
}
```

2. Создайте сервис `entities/todos/api/todos.service.ts`:
```typescript
import { api } from '@/shared/api'
import type { Todo, CreateTodoBody } from '../types/todos.types'

export const todosService = {
  getAll: () =>
    api.get<Todo[]>('todos').then(res => res.data),

  create: (data: CreateTodoBody) =>
    api.post<Todo>('todos', data).then(res => res.data),
}
```

3. Создайте query keys `entities/todos/queries/todos.keys.ts`:
```typescript
export const TODOS_QUERY_KEYS = {
  root: ['todos'] as const,
  list: () => [...TODOS_QUERY_KEYS.root, 'list'] as const,
}
```

4. Создайте queries `entities/todos/queries/todos.queries.ts`:
```typescript
import { defineQuery, useQuery, defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import { todosService } from '../api'
import { TODOS_QUERY_KEYS } from './todos.keys'

export const useTodos = defineQuery(() => {
  return useQuery({
    key: TODOS_QUERY_KEYS.list,
    query: todosService.getAll,
  })
})

export const useCreateTodo = defineMutation(() => {
  const queryCache = useQueryCache()

  return useMutation({
    mutation: todosService.create,
    onSuccess() {
      queryCache.invalidateQueries({ key: TODOS_QUERY_KEYS.root })
    },
  })
})
```

5. Экспортируйте в `entities/todos/index.ts`:
```typescript
export * from './queries'
export * from './api'
export type * from './types/todos.types'
```

6. Используйте в компоненте:
```vue
<script setup lang="ts">
import { useTodos, useCreateTodo } from '@/entities/todos'

const { data: todos, isLoading } = useTodos()
const { mutateAsync: createTodo } = useCreateTodo()

async function handleCreate() {
  await createTodo({ title: 'Новая задача' })
}
</script>
```

## Частые вопросы

### Куда положить утилиту для форматирования дат?

В `shared/lib/`, потому что это общая утилита без привязки к бизнес-логике.

```typescript
// shared/lib/format-date.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU').format(date)
}
```

### Куда положить форму регистрации?

В `features/register-form/`, потому что это пользовательский сценарий (действие).

### Когда создавать widget?

Когда блок:
- Использует несколько features/entities
- Переиспользуется на разных страницах
- Слишком большой для feature (>200 строк)

### Можно ли импортировать из shared в entities?

Да! Из нижних слоев в верхние импортировать можно.

```typescript
// entities/account/api/account.service.ts
import { api } from '@/shared/api' // ✅ Можно
```

### Можно ли импортировать из features в entities?

Нет! Это нарушит правило слоев.

```typescript
// entities/account/queries/account.queries.ts
import { AuthForm } from '@/features/auth-form' // ❌ Нельзя
```

## Полезные ссылки

- [FSD Документация](https://feature-sliced.design/ru/)
- [Vue 3 Документация](https://vuejs.org/)
- [Pinia Colada](https://pinia-colada.esm.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Следующие шаги

1. Изучите [project-structure.md](./project-structure.md) — визуальная схема проекта
2. Прочитайте [architecture.md](./architecture.md) — подробное описание слоев FSD
3. Посмотрите [components.md](./components.md) — создание UI компонентов
4. Изучите [api.md](./api.md) — работа с API

Удачи в разработке! 