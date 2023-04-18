import { createRouter, createWebHistory} from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'home',
        // vite+vue3路径配置，.vue不能省略，@需要自己额外配置
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('@/views/map/index.vue')
    },
    {
        path: '/report',
        name: 'report',
        component: () => import('@/views/report/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    }
]


const router = createRouter({
    // 指定路由工作模式为history模式
    history: createWebHistory(),
    routes: routes
})

export default router

