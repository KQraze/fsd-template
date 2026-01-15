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
    :data-maska="props.mask"
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="inputVariants({ size: props.size, error: props.error, disabled: props.disabled })"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
