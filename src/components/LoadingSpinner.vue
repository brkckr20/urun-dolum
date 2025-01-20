<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
        </div>
    </div>
</template>

<script setup>
import { useLoading } from '../composables/loading'

const { isLoading } = useLoading()
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style> 