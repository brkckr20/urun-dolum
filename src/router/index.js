import { createRouter, createWebHistory } from 'vue-router'
import MaterialCard from '../components/MaterialCard.vue'
import EntryScreen from '../components/EntryScreen.vue'

const routes = [
    {
        path: '/',
        redirect: '/materials'
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 