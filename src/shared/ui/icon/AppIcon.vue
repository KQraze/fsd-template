<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'

interface Props {
  name: string
}

const props = defineProps<Props>()

const iconComponent = computed<Component>(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg`))
})
</script>

<template>
  <component
    :is="iconComponent"
    class="inline-block shrink-0"
  />
</template>
