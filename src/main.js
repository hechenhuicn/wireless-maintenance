import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router'
import eventBus from 'vue3-eventbus'


const app = createApp(App)
//Element Plus改成中文
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(router)
app.use(eventBus)
app.mount('#app')
