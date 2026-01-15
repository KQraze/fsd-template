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
