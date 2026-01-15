<script setup lang="ts">
import { useProfile } from '@/entities/account'

const { data: profile, isLoading } = useProfile()
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold">Главная страница</h1>

    <div v-if="isLoading" class="text-gray-500">
      Загрузка...
    </div>

    <div v-else-if="profile" class="rounded-lg border border-gray-200 bg-white p-6">
      <h2 class="mb-4 text-xl font-semibold">
        Добро пожаловать, {{ profile.firstName }}!
      </h2>
      <p class="text-gray-600">
        Email: {{ profile.email }}
      </p>
    </div>

    <div v-else class="text-gray-500">
      Войдите в систему, чтобы увидеть свой профиль
    </div>
  </div>
</template>
