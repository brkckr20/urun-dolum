<script setup>
import { useRouter } from 'vue-router'
import LoadingSpinner from './components/LoadingSpinner.vue'

const router = useRouter()
</script>

<template>
  
  <div style="margin-top: 62px;">
    <router-view></router-view>
  </div>
  <LoadingSpinner />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.router-link-active {
  font-weight: bold;
  color: white !important;
}
</style>
