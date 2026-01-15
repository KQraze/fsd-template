<script setup lang="ts">
import { AppHeader } from '@/widgets'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <app-header />

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
