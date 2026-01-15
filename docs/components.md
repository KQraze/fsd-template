# UI Components

Создание и использование компонентов в shared/ui.

## Структура компонента

```
shared/ui/button/
├── AppButton.vue        # Компонент
├── button.variants.ts   # tailwind-variants стили
└── index.ts             # Public API
```

## Создание компонента

### 1. Variants (стили)

```typescript
// shared/ui/button/button.variants.ts
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  variants: {
    variant: {
      primary: 'bg-brand text-white hover:bg-brand-dark',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      ghost: 'bg-transparent hover:bg-gray-100',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

### 2. Компонент

```vue
<!-- shared/ui/button/AppButton.vue -->
<script setup lang="ts">
import { buttonVariants, type ButtonVariants } from './button.variants'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  fullWidth?: ButtonVariants['fullWidth']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
  size: 'md',
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="buttonVariants({ variant: props.variant, size: props.size, fullWidth: props.fullWidth })"
  >
    <slot />
  </button>
</template>
```

### 3. Public API

```typescript
// shared/ui/button/index.ts
export { default as AppButton } from './AppButton.vue'
export { buttonVariants, type ButtonVariants } from './button.variants'
```

## AppInput с маской

```vue
<!-- shared/ui/input/AppInput.vue -->
<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { inputVariants, type InputVariants } from './input.variants'

interface Props {
  size?: InputVariants['size']
  error?: InputVariants['error']
  disabled?: boolean
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  mask?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  size: 'md',
  error: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    v-maska
    :data-maska="mask"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="inputVariants({ size, error, disabled })"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

## AppIcon (SVG загрузчик)

```vue
<!-- shared/ui/icon/AppIcon.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'

interface Props {
  name: string
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

const iconComponent = computed<Component>(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg`))
})

const iconSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <component
    :is="iconComponent"
    :style="{ width: iconSize, height: iconSize }"
    class="inline-block shrink-0"
  />
</template>
```

### Использование

```vue
<app-icon name="arrow-right" />
<app-icon name="user" :size="32" />
```

### Правила работы с SVG иконками

#### 1. Именование файлов

Иконки должны быть в **kebab-case** (через дефис, маленькими буквами):

```
✅ Правильно:
arrow-right.svg
user-circle.svg
chevron-down.svg

❌ Неправильно:
ArrowRight.svg
user_circle.svg
chevronDown.svg
```

#### 2. Формат SVG файла

Удаляйте атрибуты `width` и `height` для корректного масштабирования:

```xml
<!-- ❌ Неправильно -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- ... -->
</svg>

<!-- ✅ Правильно -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ... -->
</svg>
```

#### 3. Цвета через currentColor

Для однотонных иконок замените все цвета на `currentColor`. Это позволит менять цвет иконки через CSS:

```xml
<!-- До -->
<svg viewBox="0 0 24 24">
  <path stroke="#000000" fill="#000000" d="..." />
</svg>

<!-- После -->
<svg viewBox="0 0 24 24">
  <path stroke="currentColor" fill="currentColor" d="..." />
</svg>
```

**Использование с цветом**:

```vue
<app-icon name="user" class="text-brand" />
<app-icon name="arrow-right" class="text-gray-500" />
```

#### 4. Структура папки icons

```
src/assets/icons/
├── arrow-right.svg
├── user.svg
├── lock.svg
├── mail.svg
└── chevron-down.svg
```

#### 5. Рекомендуемые источники иконок

- [Heroicons](https://heroicons.com/) — красивые SVG иконки от создателей Tailwind CSS
- [Lucide Icons](https://lucide.dev/) — форк Feather Icons с большим набором
- [Phosphor Icons](https://phosphoricons.com/) — гибкий набор иконок

**Важно**: После скачивания иконки обязательно:
1. Переименуйте в kebab-case
2. Удалите width/height
3. Замените цвета на currentColor (если нужно)

## Экспорт всех компонентов

```typescript
// shared/ui/index.ts
export * from './button'
export * from './input'
export * from './icon'
```

## Использование

```vue
<script setup lang="ts">
import { AppButton, AppInput, AppIcon } from '@/shared/ui'
</script>

<template>
  <app-button variant="primary" size="lg">
    <app-icon name="save" />
    Сохранить
  </app-button>

  <app-input
    v-model="phone"
    mask="+7 (###) ###-##-##"
    placeholder="Телефон"
  />
</template>
```

## Именование

- Префикс `App` для базовых компонентов: `AppButton`, `AppInput`, `AppIcon`
- Без префикса для специфичных: `LoginForm`, `UserCard`
- Файлы в kebab-case или PascalCase (выберите один стиль)
