<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DefaultLayout } from './layouts'
</script>

<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>
