import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router'
import eventBus from 'vue3-eventbus'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入需要的图表
import {MapChart, BarChart, LineChart} from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件
import {TitleComponent,TooltipComponent,GridComponent,LegendComponent,ToolboxComponent,VisualMapComponent,DatasetComponent} from 'echarts/components';
// 引入 Canvas 渲染器
import {CanvasRenderer} from 'echarts/renderers';

// 注册必须的组件
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, MapChart, CanvasRenderer,LegendComponent,ToolboxComponent,VisualMapComponent,BarChart,DatasetComponent,LineChart ]
);

const app = createApp(App)
//Element Plus改成中文
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(router)
app.use(eventBus)
app.config.globalProperties.$echarts = echarts
app.mount('#app')
