# Vue 3 + FSD Template

Шаблон проекта на Vue 3 + TypeScript с архитектурой Feature-Sliced Design (FSD).

## Технологический стек

- **Vue 3** — прогрессивный JavaScript фреймворк
- **TypeScript** — типизированный JavaScript
- **Vite** — быстрый сборщик и dev сервер
- **Vue Router** — официальный роутер для Vue
- **Pinia** — state management для Vue 3
- **Pinia Colada** — управление асинхронным состоянием (data fetching)
- **Tailwind CSS v4** — utility-first CSS фреймворк
- **tailwind-variants** — создание вариантов компонентов
- **vee-validate + Zod** — валидация форм
- **Axios** — HTTP клиент
- **Maska** — маски ввода для форм
- **VueUse** — коллекция композаблов для Vue 3

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск dev сервера

```bash
npm run dev
```

Приложение откроется на http://localhost:5173/

### Сборка для production

```bash
npm run build
```

### Проверка типов

```bash
npm run type-check
```

### Линтинг

```bash
npm run lint
```

## Структура проекта

```
src/
├── app/          # Инициализация приложения (router, layouts)
├── pages/        # Страницы приложения
├── widgets/      # Крупные блоки UI (header, footer)
├── features/     # Пользовательские сценарии (auth-form, todo-create)
├── entities/     # Бизнес-сущности (account, todos, products)
└── shared/       # Переиспользуемый код (ui, api, lib, composables)
```

## Документация

### Для начинающих

- [**Руководство для начинающих**](./docs/getting-started.md) — старт работы с проектом, объяснение FSD простыми словами
- [**Структура проекта**](./docs/project-structure.md) — детальная визуализация файлов и папок

### Архитектура

- [**FSD Architecture**](./docs/architecture.md) — подробное описание слоев FSD с примерами кода
- Слои: `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- Правила импортов между слоями
- Public API и изоляция

### Разработка

- [**UI Components**](./docs/components.md) — создание компонентов в `shared/ui`
- [**API Layer**](./docs/api.md) — работа с HTTP запросами через Axios
- [**Pinia Colada**](./docs/pinia-colada.md) — управление асинхронным состоянием
- [**Forms & Validation**](./docs/forms.md) — валидация форм с vee-validate и Zod
- [**Tailwind CSS v4**](./docs/tailwind.md) — стилизация с tailwind-variants
- [**VueUse**](./docs/vueuse.md) — коллекция композаблов для Vue 3

## Основные концепции FSD

### Слои (снизу вверх)

1. **shared/** — Переиспользуемый код (ui, api, utils)
2. **entities/** — Бизнес-сущности (account, todos)
3. **features/** — Действия пользователя (auth-form, todo-create)
4. **widgets/** — Композитные блоки (header, product-card)
5. **pages/** — Страницы приложения (home, login)
6. **app/** — Инициализация (router, providers, layouts)

### Правило зависимостей

Верхние слои могут импортировать из нижних, но не наоборот:

```typescript
// ✅ Правильно
import { AppButton } from '@/shared/ui'
import { useProfile } from '@/entities/account'

// ❌ Неправильно
// В entities нельзя импортировать из features
import { AuthForm } from '@/features/auth-form'
```

### Public API

Каждый слой экспортирует только через `index.ts`:

```typescript
// ✅ Правильно
import { useProfile } from '@/entities/account'

// ❌ Неправильно (обход Public API)
import { useProfile } from '@/entities/account/queries/account.queries'
```

## Примеры использования

### Создание нового UI компонента

```vue
<!-- shared/ui/card/AppCard.vue -->
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
  <div :class="cardVariants({ shadow })">
    <slot />
  </div>
</template>
```

### Работа с API (entity)

```typescript
// entities/todos/api/todos.service.ts
import { api } from '@/shared/api'
import type { Todo } from '../types/todos.types'

export const todosService = {
  getAll: () => api.get<Todo[]>('todos').then(res => res.data),
  create: (data: CreateTodoBody) => api.post<Todo>('todos', data).then(res => res.data),
}
```

```typescript
// entities/todos/queries/todos.queries.ts
import { defineQuery, useQuery } from '@pinia/colada'
import { todosService } from '../api'

export const useTodos = defineQuery(() => {
  return useQuery({
    key: ['todos'],
    query: todosService.getAll,
  })
})
```

### Использование в компоненте

```vue
<script setup lang="ts">
import { useTodos } from '@/entities/todos'
import { AppButton } from '@/shared/ui'

const { data: todos, isLoading } = useTodos()
</script>

<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else>
    <div v-for="todo in todos" :key="todo.id">
      {{ todo.title }}
    </div>
  </div>
</template>
```

## IDE Setup

### Рекомендуемые расширения для VS Code

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Настройка браузера

**Chromium (Chrome, Edge, Brave)**:
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Custom Object Formatter](http://bit.ly/object-formatters)

**Firefox**:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Полезные ссылки

### Официальная документация

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Feature-Sliced Design](https://feature-sliced.design/ru/)
- [Pinia](https://pinia.vuejs.org/)
- [Pinia Colada](https://pinia-colada.esm.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [tailwind-variants](https://www.tailwind-variants.org/)
- [vee-validate](https://vee-validate.logaretm.com/v4/)
- [Zod](https://zod.dev/)
- [VueUse](https://vueuse.org/)

### Руководства

- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [FSD Best Practices](https://feature-sliced.design/ru/docs/guides/examples)