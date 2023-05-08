<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { bus } from 'vue3-eventbus'


let isCollapse = ref(false);//菜单开合标记
// 监听菜单开合变动
bus.on('changeExpand', newVal => {
        isCollapse.value = newVal;
    }
)

const outOfServiceBarChart = ref(null)//barChart元素
const { proxy } = getCurrentInstance()//vue3挂载到实例上的属性，需要在这里获取


let mapChartObj = reactive({});//地图实例
let outOfServiceBarChartObj = reactive({});//柱状图实例
let mapData = reactive([]);//地图数据
let outOfServiceBarChartData = reactive([]);//柱状图数据

onMounted(() => {
  init();
});

 // echarts初始化
const init = () => {
    outOfServiceBarInit();
    // 工作台异步数据请求放到map初始化里，因为宁波地图加载也是异步，先出地图才能加载地图数据
    mapInit();
    // 浏览器大小改变时改变图表大小
    window.onresize = () => {
      mapChartObj.resize();
      outOfServiceBarChartObj.resize();
    }
}

// 柱状图初始化
const outOfServiceBarInit = () => {
  outOfServiceBarChartObj = proxy.$echarts.init(proxy.$refs.outOfServiceBarChart);
  let option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    };
  outOfServiceBarChartObj.setOption(option);
}

// 地图初始化
const mapInit = () => {

}

</script>

<template>
  <el-container>
    <el-aside :width="isCollapse? '63px':'200px'">
      <!-- 导航 -->
      <Menu/>
    </el-aside>
    <el-container class="main-container" direction="vertical">
      <Header/>
      <el-main>
        <div id="bar" ref="outOfServiceBarChart"></div>
        <div>home content</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#bar {
  width: 1000px;
  height: 300px;
}
</style>
