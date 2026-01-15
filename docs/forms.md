# Forms & Validation

Валидация форм с vee-validate и Zod.

## Установка

```bash
npm i vee-validate @vee-validate/zod zod
```

## Базовое использование

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

// 1. Определяем схему валидации
const schema = toTypedSchema(
  z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
  }),
)

// 2. Создаём форму
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
})

// 3. Определяем поля
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

// 4. Обработчик отправки
const onSubmit = handleSubmit(async (values) => {
  // values типизированы: { email: string, password: string }
  console.log(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input v-model="email" v-bind="emailAttrs" type="email" />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>

    <div>
      <input v-model="password" v-bind="passwordAttrs" type="password" />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>

    <button type="submit">Отправить</button>
  </form>
</template>
```

## Zod схемы

### Базовые типы

```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  age: z.number().min(18, 'Минимум 18 лет'),
  website: z.string().url('Некорректный URL').optional(),
  role: z.enum(['admin', 'user', 'moderator']),
})
```

### Кастомные сообщения

```typescript
const schema = z.object({
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Должна быть заглавная буква')
    .regex(/[0-9]/, 'Должна быть цифра'),
})
```

### Подтверждение пароля

```typescript
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })
```

## С UI компонентами

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { AppInput, AppButton } from '@/shared/ui'

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
  }),
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
</script>

<template>
  <form @submit="handleSubmit">
    <div>
      <app-input
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        placeholder="Email"
        :error="!!errors.email"
      />
      <p v-if="errors.email" class="text-red-500 text-sm">
        {{ errors.email }}
      </p>
    </div>

    <div>
      <app-input
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        placeholder="Пароль"
        :error="!!errors.password"
      />
      <p v-if="errors.password" class="text-red-500 text-sm">
        {{ errors.password }}
      </p>
    </div>

    <app-button type="submit">Войти</app-button>
  </form>
</template>
```

## Maska (маски ввода)

```bash
npm i maska
```

### Использование

```vue
<script setup lang="ts">
import { vMaska } from 'maska/vue'
</script>

<template>
  <!-- Телефон -->
  <input v-maska data-maska="+7 (###) ###-##-##" />

  <!-- Дата -->
  <input v-maska data-maska="##.##.####" />

  <!-- Карта -->
  <input v-maska data-maska="#### #### #### ####" />
</template>
```

### С AppInput

```vue
<app-input
  v-model="phone"
  mask="+7 (###) ###-##-##"
  placeholder="+7 (999) 999-99-99"
/>
```

## Документация

- [vee-validate](https://vee-validate.logaretm.com/v4/)
- [Zod](https://zod.dev/)
- [Maska](https://beholdr.github.io/maska/)
