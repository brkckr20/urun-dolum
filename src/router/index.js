import { createRouter, createWebHistory } from 'vue-router'
import MaterialCard from '../components/MaterialCard.vue'
import EntryScreen from '../components/EntryScreen.vue'
import LoginScreen from '../components/LoginScreen.vue'

const routes = [
    {
        path: '/',
        name: 'login', // İsteğe bağlı bir isim verebilirsiniz
        component: LoginScreen
    },
    {
        path: '/materials',
        name: 'materials',
        component: MaterialCard
    },
    {
        path: '/entry',
        name: 'entry',
        component: EntryScreen
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 