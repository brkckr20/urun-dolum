import { ref } from 'vue'

const isLoading = ref(false)
let loadingCount = 0

export function useLoading() {
    const showLoading = () => {
        loadingCount++
        isLoading.value = true
    }

    const hideLoading = () => {
        loadingCount--
        if (loadingCount <= 0) {
            loadingCount = 0
            isLoading.value = false
        }
    }

    // Async işlemleri otomatik olarak yönetmek için yardımcı fonksiyon
    const withLoading = async (asyncFn) => {
        showLoading()
        try {
            await asyncFn()
        } finally {
            hideLoading()
        }
    }

    return {
        isLoading,
        showLoading,
        hideLoading,
        withLoading
    }
} 