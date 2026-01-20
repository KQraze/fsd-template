# FSD Architecture

Углубленное изучение архитектуры Feature-Sliced Design: правила, паттерны и best practices.

> **Предварительные требования**: Прочитайте [getting-started.md](./getting-started.md) для понимания базовых концепций.

## Основные принципы FSD

### 1. Слоистая архитектура

Код организован в слои, расположенные от нижнего к верхнему. Верхние слои могут импортировать из нижних, но не наоборот.

```
┌─────────────────────────────────────┐
│  app/     — Инициализация           │  ↑ Верхний слой
├─────────────────────────────────────┤  │
│  pages/   — Страницы приложения     │  │
├─────────────────────────────────────┤  │
│  widgets/ — Композитные блоки UI    │  │ Направление
├─────────────────────────────────────┤  │ зависимостей
│  features/— Пользовательские        │  │ (импортов)
│             сценарии                │  │
├─────────────────────────────────────┤  │
│  entities/— Бизнес-сущности         │  │
├─────────────────────────────────────┤  │
│  shared/  — Переиспользуемый код    │  ↓ Нижний слой
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

## Детальное описание слоев

> Базовые концепции описаны в [getting-started.md](./getting-started.md). Здесь — продвинутые паттерны.

### entities/ — Бизнес-сущности

**Стандартная структура**:
```
entities/account/
├── model/                    # Публичное API слайса
│   └── index.ts              # Реэкспорт queries и composables
├── api/                      # API запросы
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

**Ключевые правила**:
- ✅ Импортирует из `shared/`
- ❌ Не импортирует из `features/`, `widgets/`, `pages/`, `app/`
- ❌ Не импортирует из других entities (entities/account → entities/todos ❌)
- ✅ Один entity = одна бизнес-сущность

### features/ — Пользовательские сценарии

**Отличие от entities**: feature — это **процесс** (войти в систему), entity — это **данные** (пользователь).

**Стандартная структура**:
```
features/auth-form/
├── ui/
│   └── AuthForm.vue          # Форма входа
├── lib/
│   └── validation.ts         # Схемы валидации (Zod)
├── model/
│   └── use-auth-form.ts      # Логика формы (опционально)
└── index.ts
```

**Ключевые правила**:
- ✅ Импортирует из `entities/` и `shared/`
- ❌ Не импортирует из `widgets/`, `pages/`, `app/`
- ❌ Не импортирует из других features

### widgets/ — Композитные блоки

**Когда использовать**: Блок комбинирует несколько features/entities и переиспользуется на разных страницах.

**Стандартная структура**:
```
widgets/header/
├── ui/
│   └── AppHeader.vue
├── model/                 # Опционально
│   └── use-header.ts
└── index.ts
```

**Ключевые правила**:
- ✅ Импортирует из `features/`, `entities/`, `shared/`
- ❌ Не импортирует из `pages/`, `app/`
- ❌ Не импортирует из других widgets

### pages/ — Страницы

**Важно**: У pages НЕТ `index.ts` (Public API) для работы lazy loading.

**Ключевые правила**:
- ✅ Импортирует из всех слоев ниже
- ❌ Не имеет `index.ts` (для lazy loading)
- ❌ Не импортирует из других pages
- ✅ Только композиция, минимум логики

### app/ — Инициализация

Настройка приложения: router, providers (Pinia, Pinia Colada), layouts.

**Ключевое правило**: Единственный слой, который импортирует из `pages/`.

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

### Что нельзя делать

```typescript
// ❌ Entities импортирует из features
import { AuthForm } from '@/features/auth-form'

// ❌ Features импортирует из widgets
import { AppHeader } from '@/widgets/header'

// ❌ Обход Public API
import { useProfile } from '@/entities/account/queries/account.queries'
```

## Public API

Каждый слой/слайс экспортирует функционал только через `index.ts`:

```typescript
// entities/account/index.ts
export * from './model'
export * from './api'
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

## Практические примеры

Теперь, когда вы понимаете правила, переходите к практике:

- [getting-started.md](./getting-started.md) — создание компонентов, entities и features с примерами кода
- [api.md](./api.md) — работа с HTTP запросами через Axios
- [pinia-colada.md](./pinia-colada.md) — управление асинхронным состоянием
- [Официальная документация FSD](https://feature-sliced.design/ru/) — подробные гайды и best practices