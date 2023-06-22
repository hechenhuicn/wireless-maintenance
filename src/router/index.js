import { createRouter, createWebHistory} from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'home',
        meta: {requireAuth: true},
        // vite+vue3路径配置，.vue不能省略，@需要自己额外配置
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/map',
        name: 'map',
        meta: {requireAuth: true},
        component: () => import('@/views/map/index.vue')
    },
    {
        path: '/report',
        name: 'report',
        meta: {requireAuth: true},
        component: () => import('@/views/report/index.vue'),
        children: [
            {
              path: 'material',
              name: 'material',
              component: () => import('@/views/report/material.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    },
    {
        // vue3里必须用正则表达式捕获所有路由
        path: '/:catchAll(.*)',
        name: 'view404',
        component: () => import('@/views/view404/index.vue')
    }
]


const router = createRouter({
    // 指定路由工作模式为history模式
    history: createWebHistory(),
    routes: routes
})

// 路由全局守卫
router.beforeEach((to, from , next) => {
    let isLogin = false;
    // 判断本地localstorage存的token是否过期
    if(localStorage.getItem('nb_wy_wireless_mes') && to.matched.some(record => record.meta.requireAuth)) {
        let obj = JSON.parse(localStorage.getItem('nb_wy_wireless_mes'));
        let nowTime = new Date().getTime();
        if (nowTime - obj.startTime >= obj.expires) {
            localStorage.removeItem('nb_wy_wireless_mes');
        } else {
            isLogin = true;
        }
    }
    // 没登录访问权限页面要跳到登录页面
    if (to.matched.some(record => record.meta.requireAuth) && !isLogin) {
        next({name: 'login'});
    } else {
        next();
    }
});

export default router

