<script setup lang="ts">
import { useForm } from 'vee-validate'
import { AppButton, AppInput, AppIcon } from '@/shared/ui'
import { useLogin } from '@/entities/account'
import { loginSchema } from '../lib/validation'

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { mutateAsync: login, isLoading } = useLogin()

const onSubmit = handleSubmit(async (values) => {
  await login(values)
})
</script>

<template>
  <div class="w-full max-w-md">
    <div class="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Вход</h1>
        <p class="mt-2 text-sm text-gray-600">Введите свои данные для входа в систему</p>
      </div>

      <!-- Форма -->
      <form class="space-y-5" @submit="onSubmit">
        <!-- Email -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"> Email </label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <app-icon name="mail" :size="20" class="text-gray-400" />
            </div>
            <app-input
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              placeholder="example@mail.com"
              :error="!!errors.email"
              class="pl-10"
            />
          </div>
          <p v-if="errors.email" class="mt-1.5 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <div class="mb-2 flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700"> Пароль </label>
            <a href="#" class="text-xs text-gray-500 hover:text-brand transition-colors">
              Забыли пароль?
            </a>
          </div>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <app-icon name="lock" :size="20" class="text-gray-400" />
            </div>
            <app-input
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              placeholder="Введите пароль"
              :error="!!errors.password"
              class="pl-10"
            />
          </div>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <app-icon name="lock" :size="20" class="text-gray-400" />
            </div>
            <app-input
              class="pl-10"
            />
          </div>
          <p v-if="errors.password" class="mt-1.5 text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <!-- Кнопка входа -->
        <app-button type="submit" full-width :disabled="isLoading" class="mt-2">
          <span v-if="!isLoading" class="flex items-center justify-center gap-2">
            Войти
            <app-icon name="arrow-right" :size="16" />
          </span>
          <span v-else> Загрузка... </span>
        </app-button>
      </form>
    </div>
  </div>
</template>
