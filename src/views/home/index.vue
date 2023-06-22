<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref, reactive, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import { bus } from 'vue3-eventbus'
import { getWorkbench, getNBGeojson, exportWorkbenchExcel } from '@/api'
import { Download } from '@element-plus/icons-vue'

let isCollapse = ref(false);//菜单开合标记

const side_chart_box1 = ref(null)//第一个side图表容器
const map_chart_box = ref(null)//map图表容器
const mapChart = ref(null)//map Chart元素
const outOfServiceBarChart = ref(null)//退服barChart元素
const clickAlarmBarChart = ref(null)//时钟告警barChart元素
const standingWaveAlarmBarChart = ref(null)//驻波告警barChart元素
const provinceFaultOrderBarChart = ref(null)//全省故障工单barChart元素
const nbFaultOrderBarChart = ref(null)//宁波故障工单barChart元素
const nbFaultOrderTrendLineChart = ref(null)//宁波故障工单趋势LineChart元素
const provinceQualityOrderBarChart = ref(null)//全省故障工单质量barChart元素
const nbQualityOrderBarChart = ref(null)//宁波故障工单质量barChart元素
const { proxy } = getCurrentInstance()//vue3挂载到实例上的属性，需要在这里获取

let chartObj = reactive({
  mapChartObj:{},//地图实例
  outOfServiceBarChartObj:{},//退服柱状图实例
  clickAlarmBarChartObj:{},//时钟告警柱状图实例
  standingWaveAlarmBarChartObj:{},//驻波告警柱状图实例
  provinceFaultOrderBarChartObj:{},//全省故障工单柱状图实例
  nbFaultOrderBarChartObj:{},//宁波故障工单柱状图实例
  nbFaultOrderTrendLineChartObj:{},//宁波故障工单趋势折线图实例
  provinceQualityOrderBarChartObj:{},//全省故障工单质量柱状图实例
  nbQualityOrderBarChartObj:{}//宁波故障工单质量柱状图实例
})
let chartData = reactive({
  mapData:[],//地图数据
  outOfServiceBarChartData:[],//退服柱状图数据
  clickAlarmBarChartData:[],//时钟告警柱状图数据
  standingWaveAlarmBarChartData:[],//驻波告警柱状图数据
  provinceFaultOrderBarChartData:[],//全省故障工单柱状图数据
  nbFaultOrderBarChartData:[],//宁波故障工单柱状图数据
  nbFaultOrderTrendLineChartData:[],//宁波故障工单趋势折线图数据
  provinceQualityOrderBarChartData:[],//全省故障工单质量柱状图数据
  nbQualityOrderBarChartData:[]//宁波故障工单质量柱状图数据
});
let dialogVisible = ref(false);//导出dialog显示标志
let exportType = ref('告警');// 导出类型：告警/工单

let loading = ref(false);//图表加载loading标记，true是显示，在main上
let exportLoading = ref(false);//导出加载loading标记，在整个视口上


onMounted(() => {
  // 监听菜单开合变动
  bus.on('changeExpand', changeStyle);
  init();
});

// 在组件卸载之前移除监听
onBeforeUnmount( () => {
  bus.off('changeExpand', changeStyle);
  window.removeEventListener('resize', resizeChart);
})

// 菜单开合变动时候修改对应样式
const changeStyle = (newVal) => {
  isCollapse.value = newVal;
  // console.log('开合变动')
  // menu开合不触发onresize实践修改图表大小，需在这里resize图表
  // 加定时器是因为Element-Plus中sebmenu开合延时是300ms,需要开合完成后再resize
  setTimeout(() => {
    resizeChart();
  }, 400);
}

 // echarts初始化
const init = () => {
    // 工作台异步数据请求放到map初始化里，因为宁波地图加载也是异步，先出地图才能加载地图数据
    mapInit();
    outOfServiceBarInit();
    clickAlarmBarChartInit();
    standingWaveAlarmBarChartInit();
    provinceFaultOrderBarInit();
    nbFaultOrderBarInit();
    nbFaultOrderTrendLineInit();
    provinceQualityOrderBarInit();
    nbQualityOrderBarInit();
    
    // 浏览器大小改变时改变图表大小
    window.addEventListener('resize', resizeChart);
}

// 退服柱状图初始化
const outOfServiceBarInit = () => {
  chartObj.outOfServiceBarChartObj = proxy.$echarts.init(proxy.$refs.outOfServiceBarChart,'dark');
  let option = {
      title: {
          text: '区县退服小区',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.outOfServiceBarChartObj.setOption(option);
}
// 时钟告警柱状图初始化
const clickAlarmBarChartInit = () => {
  chartObj.clickAlarmBarChartObj = proxy.$echarts.init(proxy.$refs.clickAlarmBarChart,'dark');
  let option = {
      title: {
          text: '区县时钟告警',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.clickAlarmBarChartObj.setOption(option);
}

// 驻波告警柱状图初始化
const standingWaveAlarmBarChartInit = () => {
  chartObj.standingWaveAlarmBarChartObj = proxy.$echarts.init(proxy.$refs.standingWaveAlarmBarChart,'dark');
  let option = {
      title: {
          text: '区县驻波告警',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.standingWaveAlarmBarChartObj.setOption(option);
}

// 地图初始化
const mapInit = async () => {
      loading.value = true;
      chartObj.mapChartObj = proxy.$echarts.init(proxy.$refs.mapChart,'dark');
      chartObj.mapChartObj.showLoading();
      let mapOption
      // 请求本地宁波地图
      let res = await getNBGeojson();
      // console.log('getNBGeojson res',res);
      if(res.status == 200) {
        handleGeojson(res.data);
        getWorkbenchData();
      }

      function handleGeojson(geoJson) {
        chartObj.mapChartObj.hideLoading();
        proxy.$echarts.registerMap('NB', geoJson);
        chartObj.mapChartObj.setOption(
          (mapOption = {
            title: {
              text: '当前告警分布',
              left: 'center',
              textStyle: {
                fontSize: 12
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br/>{c}'
            },
            visualMap: {
              min: 0,
              max: 100,
              text: ['More', 'Less'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['#91a4cc','#5e7199','#1f3563']
              },
              right:0,
              show: false
            },
            series: [
              {
                name: '宁波当前告警区县分布',
                type: 'map',
                map: 'NB',
                label: {
                  show: true,
                  color:'white'
                },
                data: [],//异步获取数据后更新
                // 自定义名称映射
                nameMap: {
                  '海曙区': '海曙',
                  '慈溪市': '慈溪',
                  '余姚市': '余姚',
                  '镇海区': '镇海',
                  '江北区': '江北',
                  '鄞州区': '鄞州',
                  '北仑区': '北仑',
                  '奉化区': '奉化',
                  '宁海县': '宁海',
                  '象山县': '象山'
                }
              }
            ]
          })
        );
        chartObj.mapChartObj.setOption(mapOption);
      }
}

// 全省故障工单柱状图初始化
const provinceFaultOrderBarInit = () => {
  chartObj.provinceFaultOrderBarChartObj = proxy.$echarts.init(proxy.$refs.provinceFaultOrderBarChart,'dark');
  let option = {
      title: {
          text: '全省故障工单数量',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.provinceFaultOrderBarChartObj.setOption(option);
}

// 宁波故障工单柱状图初始化
const nbFaultOrderBarInit = () => {
  chartObj.nbFaultOrderBarChartObj = proxy.$echarts.init(proxy.$refs.nbFaultOrderBarChart,'dark');
  let option = {
      title: {
          text: '宁波故障工单数量',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.nbFaultOrderBarChartObj.setOption(option);
}

// 宁波故障工单趋势柱状图初始化
const nbFaultOrderTrendLineInit = () => {
  chartObj.nbFaultOrderTrendLineChartObj = proxy.$echarts.init(proxy.$refs.nbFaultOrderTrendLineChart,'dark');
  let option = {
      title: {
          text: '宁波故障工单趋势',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'line',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.nbFaultOrderTrendLineChartObj.setOption(option);
}

// 全省故障工单质量柱状图初始化
const provinceQualityOrderBarInit = () => {
  chartObj.provinceQualityOrderBarChartObj = proxy.$echarts.init(proxy.$refs.provinceQualityOrderBarChart,'dark');
  let option = {
      title: {
          text: '全省故障工单质量',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.provinceQualityOrderBarChartObj.setOption(option);
}

// 宁波故障工单质量柱状图初始化
const nbQualityOrderBarInit = () => {
  chartObj.nbQualityOrderBarChartObj = proxy.$echarts.init(proxy.$refs.nbQualityOrderBarChart,'dark');
  let option = {
      title: {
          text: '宁波故障工单质量',
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
      xAxis: {
        type: 'category',
        axisLabel: {
          fontSize: 6
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 6
        },
      },
      tooltip: {},
      dataset: {
        source:[]//异步获取
      },
      series: [{
        type: 'bar',
        label: {
          show: true,
          color: '#fff',
          position: 'top',
          fontSize: 6
        }
      }]
    };
    chartObj.nbQualityOrderBarChartObj.setOption(option);
}

// 请求工作台数据
const getWorkbenchData = async () => {
  let res = await getWorkbench();
  // console.log('getWorkbenchData res',res);
  if(res.status == 200) {
    chartData.mapData = res.data.areaRealtimeAlarm;
    chartData.outOfServiceBarChartData = res.data.areaOutService;
    chartData.clickAlarmBarChartData = res.data.areaClockAlarm;
    chartData.standingWaveAlarmBarChartData = res.data.areaVswrAlarm;
    chartData.provinceFaultOrderBarChartData = res.data.provinceOrderNum;
    chartData.nbFaultOrderBarChartData = res.data.nbOrderNum;
    chartData.nbFaultOrderTrendLineChartData = res.data.latest_fourteen;
    chartData.provinceQualityOrderBarChartData = res.data.provin_data;
    chartData.nbQualityOrderBarChartData = res.data.district_data;
    setAsyncOption();
    resizeChart()
  }
  loading.value = false;
}

// 获取异步数据后，给charts赋数据
const setAsyncOption = () => {
  chartObj.mapChartObj.setOption({
    series: [{
      data:chartData.mapData
    }]
  });
  chartObj.outOfServiceBarChartObj.setOption({
    dataset: [{
      source:chartData.outOfServiceBarChartData
    }]
  });
  chartObj.clickAlarmBarChartObj.setOption({
    dataset: [{
      source:chartData.clickAlarmBarChartData
    }]
  });
  chartObj.standingWaveAlarmBarChartObj.setOption({
    dataset: [{
      source:chartData.standingWaveAlarmBarChartData
    }]
  });
  chartObj.provinceFaultOrderBarChartObj.setOption({
    dataset: [{
      source:chartData.provinceFaultOrderBarChartData
    }]
  });
  chartObj.nbFaultOrderBarChartObj.setOption({
    dataset: [{
      source:chartData.nbFaultOrderBarChartData
    }]
  });
  chartObj.nbFaultOrderTrendLineChartObj.setOption({
    dataset: [{
      source:chartData.nbFaultOrderTrendLineChartData
    }]
  });
  chartObj.provinceQualityOrderBarChartObj.setOption({
    dataset: [{
      source:chartData.provinceQualityOrderBarChartData
    }]
  });
  chartObj.nbQualityOrderBarChartObj.setOption({
    dataset: [{
      source:chartData.nbQualityOrderBarChartData
    }]
  });
}

//重新计算chart盒子宽高并将此宽高赋值给chart
const calchartssize = () => {
  // 计算盒子宽高
  function getStyle(el, name) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, name);
    } else {
      return el.currentStyle;
    }
  }
  let sideBoxWidth = getStyle(proxy.$refs.side_chart_box1, 'width').width;
  let sideBoxHeight = getStyle(proxy.$refs.side_chart_box1, 'height').height;
  let middleMapWidth = getStyle(proxy.$refs.map_chart_box, 'width').width;
  let middleMapHeight = getStyle(proxy.$refs.map_chart_box, 'height').height;
  // console.log('side宽高',sideBoxWidth,sideBoxHeight)
  // 设置两边小图宽高
  let chartArr = [
    'outOfServiceBarChart',
    'clickAlarmBarChart',
    'standingWaveAlarmBarChart',
    'provinceFaultOrderBarChart',
    'nbFaultOrderBarChart',
    'nbFaultOrderTrendLineChart',
    'provinceQualityOrderBarChart',
    'nbQualityOrderBarChart'
  ]
  chartArr.forEach(chart => {
    proxy.$refs[chart].style.width = sideBoxWidth;
    proxy.$refs[chart].style.height = sideBoxHeight;
  })
  // 设置中间地图宽高
  proxy.$refs.mapChart.style.width = middleMapWidth;
  proxy.$refs.mapChart.style.height = middleMapHeight;
}

// 视口调整时重新设置chart宽高
const resizeChart = () => {
  calchartssize();

  chartObj.mapChartObj.resize();
  chartObj.outOfServiceBarChartObj.resize();
  chartObj.clickAlarmBarChartObj.resize();
  chartObj.standingWaveAlarmBarChartObj.resize();
  chartObj.provinceFaultOrderBarChartObj.resize();
  chartObj.nbFaultOrderBarChartObj.resize();
  chartObj.nbFaultOrderTrendLineChartObj.resize();
  chartObj.provinceQualityOrderBarChartObj.resize();
  chartObj.nbQualityOrderBarChartObj.resize();
}
// 导出告警EXCEL
const exportAlarm = async () => {
  exportLoading.value = true;
  // 将loading的遮罩放最前面，不然会被dialog遮挡
  // 异步下才能获取到遮罩元素，同步获取遮罩元素还是null
  setTimeout(() => {
    document.querySelector(".el-loading-mask").style.zIndex = "3000";
  })
  await exportWorkbenchExcel(exportType.value);
  exportLoading.value = false;
}

</script>

<template>
  <el-container v-loading="exportLoading">
    <el-aside :width="isCollapse? '63px':'200px'">
      <!-- 导航 -->
      <Menu/>
    </el-aside>
    <el-container class="main-container" direction="vertical">
      <Header/>
      <el-main v-loading="loading">
        <el-row>
          <el-col id="col_button">
            <el-button size="small" color="#000" dark :icon="Download" @click="dialogVisible = true">导出</el-button>
            
            <!-- 导出对话框 -->
            <el-dialog v-model="dialogVisible" title="导出" width="30%" align-center>
              <el-radio-group v-model="exportType">
                <el-radio label="告警">告警</el-radio>
                <el-radio label="工单">工单</el-radio>
              </el-radio-group>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="exportAlarm">确认</el-button>
                </span>
              </template>
            </el-dialog>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" id="col_left">
            <el-container id="left_container">
              <div class="side_chart_box" ref="side_chart_box1">
                <div id="out_of_service_bar" ref="outOfServiceBarChart"></div>
              </div>
              <div class="side_chart_box">
                <div id="click_alarm_bar" ref="clickAlarmBarChart"></div>
              </div> 
              <div class="side_chart_box">
                <div id="standing_wave_alarm_bar" ref="standingWaveAlarmBarChart"></div>
              </div>
              <div class="side_chart_box">
                <div id="nb_fault_order_trend" ref="nbFaultOrderTrendLineChart"></div>
              </div>
            </el-container>
          </el-col>
          <el-col :span="12" id="col_middle">
              <div class="map_chart_box" ref="map_chart_box">
                <div id="map_chart" ref="mapChart"></div>
              </div>
          </el-col>
          <el-col :span="6">
            <el-container id="right_container">
              <div class="side_chart_box">
                <div id="province_fault_order" ref="provinceFaultOrderBarChart"></div>
              </div>
              <div class="side_chart_box">
                <div id="nb_fault_order" ref="nbFaultOrderBarChart"></div>
              </div>
              <div class="side_chart_box">
                <div id="province_quality_order_bar" ref="provinceQualityOrderBarChart"></div>
              </div>
              <div class="side_chart_box">
                <div id="nb_quality_order_bar" ref="nbQualityOrderBarChart"></div>
              </div>
            </el-container>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-col {
  display: flex;
}
.el-col {
  justify-content: center;
}
#map_chart {
  width: 500px;
  height: 480px;
}
#out_of_service_bar, #click_alarm_bar, #standing_wave_alarm_bar, #province_fault_order,#nb_fault_order,#nb_fault_order_trend {
  width: 250px;
  height: 180px;
}
#province_quality_order_bar, #nb_quality_order_bar {
  width: 250px;
  height: 180px;
}
/* 侧边容器flex主轴设为垂直方向,交叉轴方向左边靠右，右边靠左 */
#left_container, #middle_container {
  flex-direction:column;
  /* align-items:flex-end; */
}
#right_container {
  flex-direction:column;
}
#col_middle {
  background-color: #100c2a;
}
.el-main {
  background-color:black;
}
.side_chart_box{
  width: 90%;
  height: 80%;
  margin: auto auto;
}
.map_chart_box{
  width: 90%;
  height: 80%;
  margin: auto auto;
}
#col_button {
  justify-content:flex-end;
}
</style>
