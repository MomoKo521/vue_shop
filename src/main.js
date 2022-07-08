import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
// elemnet ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

// axios
import axios from 'axios'
// 设置axios请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
    // 全局挂载axios请求
Vue.prototype.$http = axios
    // 通过拦截器给其他接口添加token临牌(差不多就是每次发起axios请求都会把网页中的token值传到请求头中 根据token判断是否有权限发起请求)
axios.interceptors.request.use(config => {
    // 给请求添加一个Authorization权限  Authorization存在token值就能发起aixos请求
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // console.log(config)
    return config
})

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')