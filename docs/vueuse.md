# VueUse

Коллекция композаблов для Vue 3 — готовые решения для типичных задач.

## Установка

```bash
npm install @vueuse/core
```

**Уже включено в проект** (версия 14.1.0)

## Основные категории

### State (Состояние)

#### useLocalStorage / useSessionStorage

Реактивное хранилище в localStorage/sessionStorage.

```typescript
import { useLocalStorage } from '@vueuse/core'

// Простое использование
const token = useLocalStorage('auth-token', '')

// С типизацией
interface User {
  id: number
  name: string
}

const user = useLocalStorage<User | null>('user', null)

// Автоматически синхронизируется с localStorage
token.value = 'new-token' // → сохраняется в localStorage
```

#### useToggle

Переключатель boolean значения.

```typescript
import { useToggle } from '@vueuse/core'

const [isDark, toggleDark] = useToggle(false)

// Использование
toggleDark() // true
toggleDark() // false
toggleDark(true) // явно установить true
```

#### useDebouncedRef

Ref с задержкой обновления.

```typescript
import { useDebouncedRef } from '@vueuse/core'

const search = useDebouncedRef('', 500) // 500ms задержка

// В компоненте
watch(search, (value) => {
  // Вызовется только через 500ms после последнего изменения
  searchAPI(value)
})
```

### Browser (Браузер)

#### useClipboard

Работа с буфером обмена.

```vue
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { text, copy, copied, isSupported } = useClipboard()

async function copyToClipboard() {
  await copy('Текст для копирования')
  // copied.value будет true в течение 1.5 секунд
}
</script>

<template>
  <div>
    <button @click="copyToClipboard" :disabled="!isSupported">
      {{ copied ? 'Скопировано!' : 'Копировать' }}
    </button>
  </div>
</template>
```

#### useTitle

Управление title страницы.

```typescript
import { useTitle } from '@vueuse/core'

// Реактивный title
const title = useTitle('Главная страница')

// Изменяется динамически
title.value = 'Профиль пользователя'
```

#### useFavicon

Управление favicon.

```typescript
import { useFavicon } from '@vueuse/core'

const icon = useFavicon()

// Изменить иконку
icon.value = '/favicon-dark.ico'
```

#### useMediaQuery

Отслеживание media queries.

```typescript
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 768px)')
const isDark = useMediaQuery('(prefers-color-scheme: dark)')
const isPortrait = useMediaQuery('(orientation: portrait)')
```

```vue
<template>
  <div>
    <div v-if="isMobile">Мобильная версия</div>
    <div v-else>Десктопная версия</div>
  </div>
</template>
```

#### usePreferredDark

Определение темной темы системы.

```typescript
import { usePreferredDark } from '@vueuse/core'

const isDark = usePreferredDark()
```

### Sensors (Сенсоры)

#### useMouse

Отслеживание позиции мыши.

```vue
<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const { x, y, sourceType } = useMouse()
</script>

<template>
  <div>Позиция мыши: {{ x }}, {{ y }}</div>
</template>
```

#### useScroll

Отслеживание прокрутки.

```vue
<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { ref } from 'vue'

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(el)
</script>

<template>
  <div ref="el" class="overflow-auto h-96">
    <div>Прокрутка: {{ y }}px</div>
    <div v-if="arrivedState.bottom">Достигнут конец</div>
  </div>
</template>
```

#### useIntersectionObserver

Отслеживание видимости элемента.

```vue
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting
  }
)
</script>

<template>
  <div ref="target">
    {{ isVisible ? 'Виден' : 'Не виден' }}
  </div>
</template>
```

### Network (Сеть)

#### useFetch

HTTP запросы (альтернатива axios для простых случаев).

```typescript
import { useFetch } from '@vueuse/core'

const { data, error, isFetching } = useFetch('https://api.example.com/data').json()
```

> **Примечание**: Для сложных сценариев используйте Pinia Colada + Axios (см. [pinia-colada.md](./pinia-colada.md))

#### useOnline

Отслеживание статуса подключения.

```vue
<script setup lang="ts">
import { useOnline } from '@vueuse/core'

const isOnline = useOnline()
</script>

<template>
  <div v-if="!isOnline" class="bg-yellow-100 p-4">
    Нет подключения к интернету
  </div>
</template>
```

### Component (Компоненты)

#### useVModel

Двусторонняя привязка для props.

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const value = ref('')
</script>

<template>
  <child-component v-model="value" />
</template>
```

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <input v-model="value" />
</template>
```

#### useTemplateRefsList

Список refs для v-for.

```vue
<script setup lang="ts">
import { useTemplateRefsList } from '@vueuse/core'

const items = ref(['Item 1', 'Item 2', 'Item 3'])
const itemRefs = useTemplateRefsList<HTMLElement>()
</script>

<template>
  <div v-for="item in items" :key="item" :ref="itemRefs.set">
    {{ item }}
  </div>
</template>
```

### Animation (Анимация)

#### useTransition

Анимированный переход между значениями.

```vue
<script setup lang="ts">
import { useTransition } from '@vueuse/core'
import { ref } from 'vue'

const count = ref(0)
const animatedCount = useTransition(count, {
  duration: 500,
})

function increment() {
  count.value += 100
}
</script>

<template>
  <div>
    <div>{{ animatedCount.toFixed(0) }}</div>
    <button @click="increment">+100</button>
  </div>
</template>
```

## Интеграция с FSD

### В shared/composables

Переиспользуемые композаблы на базе VueUse:

```typescript
// shared/composables/use-theme.ts
import { usePreferredDark, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export function useTheme() {
  const prefersDark = usePreferredDark()
  const userTheme = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto')

  const isDark = computed(() => {
    if (userTheme.value === 'auto') {
      return prefersDark.value
    }
    return userTheme.value === 'dark'
  })

  function setTheme(theme: 'light' | 'dark' | 'auto') {
    userTheme.value = theme
  }

  return {
    isDark,
    theme: userTheme,
    setTheme,
  }
}
```

```typescript
// shared/composables/index.ts
export * from './use-theme'
export * from './use-auth'
```

### В features

Использование VueUse в features:

```vue
<!-- features/copy-button/ui/CopyButton.vue -->
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { AppButton } from '@/shared/ui'

interface Props {
  text: string
}

const props = defineProps<Props>()

const { copy, copied } = useClipboard()

async function handleCopy() {
  await copy(props.text)
}
</script>

<template>
  <app-button @click="handleCopy" variant="ghost" size="sm">
    {{ copied ? 'Скопировано!' : 'Копировать' }}
  </app-button>
</template>
```

## Полезные паттерны

### Lazy loading с useIntersectionObserver

```vue
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

const target = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting && !shouldLoad.value) {
    shouldLoad.value = true
  }
})
</script>

<template>
  <div ref="target">
    <heavy-component v-if="shouldLoad" />
    <div v-else>Загрузка...</div>
  </div>
</template>
```

### Debounced search

```vue
<script setup lang="ts">
import { useDebouncedRef } from '@vueuse/core'
import { watch } from 'vue'
import { useSearchProducts } from '@/entities/products'

const search = useDebouncedRef('', 300)
const { data: products, refetch } = useSearchProducts(search)

watch(search, () => {
  if (search.value.length >= 2) {
    refetch()
  }
})
</script>

<template>
  <input v-model="search" placeholder="Поиск..." />
  <div v-for="product in products" :key="product.id">
    {{ product.name }}
  </div>
</template>
```

### Responsive layout

```vue
<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 1025px)')
</script>

<template>
  <div>
    <mobile-layout v-if="isMobile" />
    <tablet-layout v-else-if="isTablet" />
    <desktop-layout v-else-if="isDesktop" />
  </div>
</template>
```

## Документация

- [Официальная документация VueUse](https://vueuse.org/)
- [Список всех композаблов](https://vueuse.org/functions.html)
- [Playground](https://vueuse.org/playground/)

## Рекомендации

1. **Не переусердствуйте**: Используйте VueUse для типичных задач, для сложной бизнес-логики создавайте свои композаблы
2. **Композиция**: Комбинируйте несколько VueUse функций для создания кастомных решений
3. **Tree-shaking**: VueUse отлично работает с tree-shaking, импортируйте только то, что нужно
4. **Типизация**: Все композаблы полностью типизированы из коробки
