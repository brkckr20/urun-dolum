<script setup>
import { useRouter } from 'vue-router'
import LoadingSpinner from './components/LoadingSpinner.vue'

const router = useRouter()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary"
    style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000;">
    <div class=" container">
      <ul class="navbar-nav d-flex flex-row gap-2">
        <li class="nav-item">
          <router-link class="nav-link" to="/materials">🗂️ Ürünler</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/entry">✅ Girişler</router-link>
        </li>
      </ul>
    </div>
  </nav>

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
