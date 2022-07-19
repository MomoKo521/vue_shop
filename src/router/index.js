import Vue from 'vue'
import VueRouter from 'vue-router'
import LOGIN from '@/views/login.vue' //登陆组件
import HOME from '@/views/home.vue' //主页组件
import USERS from '@/components/user/user.vue' //用户组件
import WELCOME from '@/views/welcome.vue' //主页初始化组件
import Rights from '@/components/power/Rights.vue' //权限管理/权限列表组件
import Roles from '@/components/power/Roles.vue' //权限管理/角色列表组件
import Cate from '@/components/goods/Cate.vue' //商品管理/商品分类组件
import Params from '@/components/goods/Params.vue' //商品管理/分类参数组件
import List from '@/components/goods/List.vue' //商品管理/商品列表组件
import addList from '@/components/goods/addList.vue' //商品管理/添加商品组件
import Order from '@/components/goods/Order.vue' //商品管理/商品订单管理组件
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: 'LOGIN' },
    { path: '/login', component: LOGIN },
    {
        path: '/home',
        component: HOME,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: WELCOME },
            { path: '/users', component: USERS },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: List },
            { path: '/addlist', component: addList },
            { path: '/orders', component: Order, }
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