import Vue from 'vue'
import VueRouter from 'vue-router'
import LOGIN from '@/views/login.vue' //登陆组件
import HOME from '@/views/home.vue' //主页组件
import USERS from '@/components/user/user.vue' //用户组件
import WELCOME from '@/views/welcome.vue' //主页初始化组件
import Rights from '@/components/power/Rights.vue' //权限管理权限列表组件
import Roles from '@/components/power/Roles.vue' //权限管理角色列表组件
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
            { path: '/welcome', component: WELCOME },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles }
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