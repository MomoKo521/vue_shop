import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 初始化样式表
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
    //element 中并没有提供树形表格插件，所以需要依赖于第三方的插件。我们使用vue-table-with-tree-grid。
    //用Vue.component注册为全局组件 
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 定义一个全局时间过滤器
// 因为有时候数据的时间是int 秒数  要转换成时间
Vue.filter('dataFromat', function(tiem) {
    const dt = new Date(tiem)
        // 获取年
    const y = dt.getFullYear()
        // 获取月
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        // 获取日
    const d = (dt.getDate() + '').padStart(2, '0')

    // 获取时
    const hh = (dt.getHours() + '').padStart(2, '0')
        // 获取分
    const mm = (dt.getMinutes() + '').padStart(2, '0')
        //获取秒
    const ss = (dt.getSeconds() + '').padStart(2, '0')
        // 拼接
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


// 富文本组件
// 导入富文本组件
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本组件样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 挂载富文本组件未全局组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')