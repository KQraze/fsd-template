<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { inputVariants, type InputVariants } from '@/shared'

interface Props {
  size?: InputVariants['size']
  error?: InputVariants['error']
  disabled?: boolean
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  mask?: string
}

withDefaults(defineProps<Props>(), {
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
