<script setup lang="ts">
import { buttonVariants, type ButtonVariants } from '@/shared'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  variant: 'primary',
  size: 'md',
})
</script>

<template>
  <button :type="type" :disabled="disabled" :class="buttonVariants({ variant, size, fullWidth })">
    <slot />
  </button>
</template>
