# Tailwind CSS v4

Tailwind CSS v4 использует CSS-first подход — конфигурация через CSS вместо JavaScript.

## Подключение

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/assets/css/main.css */
@import 'tailwindcss';
```

## Кастомизация через @theme

Вместо `tailwind.config.js` используется директива `@theme`:

```css
@import 'tailwindcss';

@theme {
  /* Цвета */
  --color-brand: #3b82f6;
  --color-brand-dark: #1d4ed8;
  --color-brand-light: #60a5fa;
  --color-accent: #8b5cf6;

  /* Шрифты */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-128: 32rem;
}
```

### Использование

```html
<div class="bg-brand text-white">Brand color</div>
<div class="font-sans">Inter font</div>
<div class="p-18">Custom spacing</div>
```

## tailwind-variants

Библиотека для создания вариантов компонентов.

### Установка

```bash
npm i tailwind-variants
```

### Создание вариантов

```typescript
// shared/ui/button/button.variants.ts
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  variants: {
    variant: {
      primary: 'bg-brand text-white hover:bg-brand-dark',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      ghost: 'bg-transparent hover:bg-gray-100',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

### Использование в компоненте

```vue
<script setup lang="ts">
import { buttonVariants, type ButtonVariants } from './button.variants'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  fullWidth?: ButtonVariants['fullWidth']
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    :disabled="props.disabled"
    :class="buttonVariants({ variant: props.variant, size: props.size, fullWidth: props.fullWidth })"
  >
    <slot />
  </button>
</template>
```

### Compound Variants

Комбинации вариантов:

```typescript
export const buttonVariants = tv({
  base: '...',
  variants: {
    variant: { primary: '...', danger: '...' },
    size: { sm: '...', md: '...' },
  },
  compoundVariants: [
    {
      variant: 'danger',
      size: 'lg',
      class: 'uppercase tracking-wide',
    },
  ],
})
```

### Утилиты cn и cx

```typescript
import { tv, cn, cx } from 'tailwind-variants'

// cx - объединяет классы (как clsx)
cx('bg-red-500', condition && 'text-white')

// cn - объединяет и мержит конфликтующие классы
cn('bg-red-500', 'bg-blue-500') // => 'bg-blue-500'
```

## Структура файлов

```
shared/ui/button/
├── AppButton.vue
├── button.variants.ts
└── index.ts
```

## Документация

- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [tailwind-variants](https://www.tailwind-variants.org/docs/introduction)
