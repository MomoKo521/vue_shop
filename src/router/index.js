import Vue from 'vue'
import VueRouter from 'vue-router'
import LOGIN from '@/views/login.vue'
import HOME from '@/views/home.vue'
import USERS from '@/components/user/user.vue'
import WELCOME from '@/views/welcome.vue'
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: 'LOGIN' },
    { path: '/login', component: LOGIN },
    {
        path: '/home',
        component: HOME,
        redirect: '/welcome',
        children: [
            { path: '/users', component: USERS },
            { path: '/welcome', component: WELCOME }
        ]
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // 如果用户访问的登陆页面，直接放行
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        next('/login')
    } else {
        next()
    }
})
export default router