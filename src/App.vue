<script setup>
import { useRouter } from 'vue-router'
import LoadingSpinner from './components/LoadingSpinner.vue'

const router = useRouter()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/materials">Kartlar</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/entry">Girişler</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <router-view></router-view>
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
