# Структура проекта

Полная структура проекта с описанием каждой директории и файла.

## Общая схема

```
new-fsd/
├── src/                        # Исходный код приложения
│   ├── app/                    # [Слой] Инициализация приложения
│   ├── pages/                  # [Слой] Страницы
│   ├── widgets/                # [Слой] Композитные блоки
│   ├── features/               # [Слой] Пользовательские сценарии
│   ├── entities/               # [Слой] Бизнес-сущности
│   └── shared/                 # [Слой] Переиспользуемый код
├── public/                     # Статические файлы
├── docs/                       # Документация проекта
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Детальная структура

### src/app/ — Инициализация приложения

```
app/
├── App.vue                     # Корневой компонент
├── main.ts                     # Точка входа (createApp, mount)
├── router/
│   └── index.ts                # Vue Router (createRouter)
└── layouts/
    ├── DefaultLayout.vue       # Базовый layout (header + main)
    ├── AuthLayout.vue          # Layout для страниц аутентификации
    └── index.ts                # Public API layouts
```

**Назначение**:
- Запуск приложения
- Настройка роутера, Pinia, Pinia Colada
- Глобальные layouts

### src/pages/ — Страницы

```
pages/
├── home/
│   └── HomePage.vue            # Главная страница
└── login/
    └── LoginPage.vue           # Страница входа
```

**Особенности**:
- **НЕТ** `index.ts` файлов (для lazy loading)
- Каждая страница = отдельный роут
- Только композиция, минимум логики

**Роутинг**:
```typescript
// shared/lib/router/routes.ts
{
  path: '/',
  component: () => import('@/pages/home/HomePage.vue')
}
```

### src/widgets/ — Композитные блоки

```
widgets/
├── header/
│   ├── ui/
│   │   └── AppHeader.vue       # Компонент шапки
│   └── index.ts                # Public API
└── index.ts                    # Общий Public API widgets
```

**Назначение**:
- Крупные блоки UI
- Композиция features + entities
- Переиспользуемые на разных страницах

### src/features/ — Пользовательские сценарии

```
features/
└── index.ts                    # Public API (пока пусто)
```

**Примеры features** (которые можно добавить):
```
features/
├── auth-form/                  # Форма входа/регистрации
│   ├── ui/
│   │   └── AuthForm.vue
│   └── index.ts
├── todo-create/                # Создание задачи
│   ├── ui/
│   │   └── TodoCreate.vue
│   └── index.ts
└── index.ts
```

### src/entities/ — Бизнес-сущности

```
entities/
├── account/                    # Сущность "Пользователь"
│   ├── model/
│   │   └── index.ts            # Реэкспорт queries
│   ├── services/
│   │   ├── account.service.ts  # API методы (login, profile, logout)
│   │   └── index.ts
│   ├── queries/
│   │   ├── account.keys.ts     # Query keys для кеширования
│   │   ├── account.queries.ts  # useProfile, useLogin (Pinia Colada)
│   │   └── index.ts
│   ├── types/
│   │   ├── account.types.ts    # Account, LoginBody, LoginResponse
│   │   └── index.ts
│   └── index.ts                # Public API entity
└── index.ts                    # Общий Public API entities
```

**Структура entity**:
- `model/` — публичное API (queries, composables)
- `services/` — HTTP запросы через axios
- `queries/` — Pinia Colada (useQuery, useMutation)
- `types/` — TypeScript интерфейсы

### src/shared/ — Переиспользуемый код

```
shared/
├── api/                        # HTTP клиент
│   ├── instance.ts             # Axios instance с interceptors
│   ├── consts.ts               # ApiStatus enum (200, 401, 404...)
│   ├── types.ts                # ApiResponse, ApiError
│   └── index.ts
├── ui/                         # UI библиотека
│   ├── button/
│   │   ├── AppButton.vue       # Компонент кнопки
│   │   ├── button.variants.ts  # Tailwind variants (primary, secondary...)
│   │   └── index.ts
│   ├── input/
│   │   ├── AppInput.vue        # Компонент инпута (с маской)
│   │   ├── input.variants.ts   # Tailwind variants (size, error...)
│   │   └── index.ts
│   ├── icon/
│   │   ├── AppIcon.vue         # SVG иконки (динамическая загрузка)
│   │   └── index.ts
│   └── index.ts                # Public API всех UI компонентов
├── lib/                        # Утилиты и хелперы
│   ├── router/
│   │   ├── routes.ts           # Определение роутов
│   │   └── index.ts
│   └── index.ts
├── composables/                # Vue composables
│   ├── use-auth.ts             # useAuth (isAuth, setToken, removeToken)
│   └── index.ts
├── types/
│   └── index.ts                # Общие TypeScript типы
└── index.ts                    # Главный Public API shared
```

**Принципы shared/**:
- Код **не знает** о бизнес-логике
- Может быть переиспользован в любом проекте
- Универсальные утилиты и компоненты

## Файлы конфигурации

```
new-fsd/
├── package.json                # Зависимости, скрипты
├── package-lock.json           # Lockfile NPM
├── tsconfig.json               # TypeScript конфигурация
├── tsconfig.app.json           # TypeScript для app
├── tsconfig.node.json          # TypeScript для Node.js (Vite config)
├── vite.config.ts              # Vite конфигурация
├── eslint.config.ts            # ESLint правила
└── env.d.ts                    # TypeScript декларации для env
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

**Алиасы**:
- `@/` → `src/`
- `@/shared` → `src/shared`
- `@/entities/account` → `src/entities/account`

### tsconfig.json

Настройки TypeScript для корректной типизации Vue компонентов, путей и импортов.

## Структура по слоям

### Визуализация зависимостей

```
┌──────────────────────────────────────────┐
│  app/                                    │
│  ↓ может импортировать все слои          │
├──────────────────────────────────────────┤
│  pages/                                  │
│  ↓ импортирует widgets, features,        │
│    entities, shared                      │
├──────────────────────────────────────────┤
│  widgets/                                │
│  ↓ импортирует features, entities,       │
│    shared                                │
├──────────────────────────────────────────┤
│  features/                               │
│  ↓ импортирует entities, shared          │
├──────────────────────────────────────────┤
│  entities/                               │
│  ↓ импортирует только shared             │
├──────────────────────────────────────────┤
│  shared/                                 │
│  ↓ не импортирует другие слои            │
└──────────────────────────────────────────┘
```

## Public API

Каждый слой и слайс экспортирует функционал только через `index.ts`:

```typescript
// entities/account/index.ts
export * from './model'
export * from './services'
export type * from './types/account.types'

// shared/ui/button/index.ts
export { default as AppButton } from './AppButton.vue'
export { buttonVariants, type ButtonVariants } from './button.variants'

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
// ✅ Правильно — через Public API
import { AppButton, AppInput } from '@/shared/ui'
import { useProfile } from '@/entities/account'
import { api } from '@/shared/api'

// ❌ Неправильно — обход Public API
import AppButton from '@/shared/ui/button/AppButton.vue'
import { useProfile } from '@/entities/account/queries/account.queries'
```

## Добавление нового кода

### Новый UI компонент

1. Создайте папку в `shared/ui/`:
```
shared/ui/card/
├── AppCard.vue
├── card.variants.ts
└── index.ts
```

2. Добавьте в `shared/ui/index.ts`:
```typescript
export * from './card'
```

### Новая entity

1. Создайте структуру:
```
entities/todos/
├── model/
│   └── index.ts
├── services/
│   ├── todos.service.ts
│   └── index.ts
├── queries/
│   ├── todos.keys.ts
│   ├── todos.queries.ts
│   └── index.ts
├── types/
│   ├── todos.types.ts
│   └── index.ts
└── index.ts
```

2. Добавьте в `entities/index.ts`:
```typescript
export * from './todos'
```

### Новая feature

1. Создайте структуру:
```
features/todo-create/
├── ui/
│   └── TodoCreate.vue
└── index.ts
```

2. Добавьте в `features/index.ts`:
```typescript
export * from './todo-create'
```

### Новая страница

1. Создайте папку в `pages/`:
```
pages/about/
└── AboutPage.vue
```

2. Добавьте роут в `shared/lib/router/routes.ts`:
```typescript
{
  path: '/about',
  name: 'about',
  component: () => import('@/pages/about/AboutPage.vue')
}
```

## Дополнительные материалы

- [getting-started.md](./getting-started.md) — руководство для начинающих
- [architecture.md](./architecture.md) — подробное описание FSD
- [components.md](./components.md) — создание UI компонентов
- [api.md](./api.md) — работа с API
- [pinia-colada.md](./pinia-colada.md) — управление асинхронным состоянием