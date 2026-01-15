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

**Особенность**: Нет `index.ts` для lazy loading

### src/widgets/ — Композитные блоки

```
widgets/
├── header/
│   ├── ui/
│   │   └── AppHeader.vue       # Компонент шапки
│   └── index.ts                # Public API
└── index.ts                    # Общий Public API widgets
```

> Подробнее о widgets в [getting-started.md](./getting-started.md#widgets--композитные-блоки)

### src/features/ — Пользовательские сценарии
```
features/
├── auth-form/                  # Форма входа/регистрации
│   ├── ui/
│   │   └── AuthForm.vue
│   ├── lib/
│   │   └── validation.ts       # Схемы валидации (Zod)
│   └── index.ts
├── todo-create/                # Создание задачи
│   ├── ui/
│   │   └── TodoCreate.vue
│   ├── lib/
│   │   └── validation.ts       # Схемы валидации (Zod)
│   └── index.ts
└── index.ts
```

> Подробнее о features в [getting-started.md](./getting-started.md#features--пользовательские-сценарии)

### src/entities/ — Бизнес-сущности

```
entities/
├── account/                    # Сущность "Пользователь"
│   ├── model/
│   │   └── index.ts            # Реэкспорт queries
│   ├── api/
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

> Подробнее о entities в [getting-started.md](./getting-started.md#entities--бизнес-сущности)

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

> Подробнее о shared в [getting-started.md](./getting-started.md#shared--общий-код)

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

Каждый слой экспортирует функционал только через `index.ts`. Подробнее в [getting-started.md](./getting-started.md#правила-импортов)

## Следующие шаги

После изучения структуры проекта переходите к:
- [getting-started.md](./getting-started.md) — как создавать новые компоненты, entities, features
- [architecture.md](./architecture.md) — глубокое погружение в правила FSD
- [api.md](./api.md) — работа с HTTP запросами
- [pinia-colada.md](./pinia-colada.md) — управление асинхронным состоянием