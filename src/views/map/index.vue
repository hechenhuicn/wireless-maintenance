<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref, reactive, onMounted } from 'vue'
import { bus } from 'vue3-eventbus'
import 'ol/ol.css';
import {Map, View} from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
// import LayerGroup from 'ol/layer/Group';

let isCollapse = ref(false);//菜单开合标记
let searchForm = reactive({
  alarmType: '',//告警类别
  attribute: '',//属性
  county: ''//区县
})
//county option使用
const countyArr = ['慈溪','余姚','北仑','镇海','海曙','鄞州','江北','奉化','宁海','象山']
let map = reactive({}) // 存放地图实例

onMounted(() => {
  initMap();
})
// 监听菜单开合变动
bus.on('changeExpand', newVal => {
        isCollapse.value = newVal;
    }
)
// 查询
const search = () => {

}
// 导出
const leadingout = () => {d

}
// 初始化地图
const initMap = () => {
  //天地图路网
  let tian_di_tu_road_layer = new TileLayer({
      title: "天地图路网",
      source: new XYZ({
          url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=08613feba1c52f4bafec82106ae082b4"
      })
  });
  //天地图注记
  let tian_di_tu_annotation = new TileLayer({
      title: "天地图文字标注",
      source: new XYZ({
          url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=08613feba1c52f4bafec82106ae082b4'
      })
  });

  map = new Map({
    target: 'map',
    layers:[tian_di_tu_road_layer, tian_di_tu_annotation],
    view: new View({
      // 默认是EPSG:3857-墨卡托坐标系，数据源用的EPSG:4326-WGS84坐标系
      projection: 'EPSG:4326',
      center: [121.55131,29.87198],
      zoom: 12
    })
  })
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
        <!-- 查询form -->
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="告警类别">
            <el-select v-model="searchForm.alarmType" placeholder="请选择" clearable>
              <!-- 要后端反馈 -->
              <el-option label="退服" value="shanghai"></el-option>
              <el-option label="时钟" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性">
            <el-select v-model="searchForm.attribute" placeholder="请选择" multiple collapse-tags collapse-tags-tooltip>
              <!-- 要后端反馈 -->
              <el-option label="VIP" value="shanghai"></el-option>
              <el-option label="投诉" value="beijing"></el-option>
              <el-option label="政企" value="hangzhou"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区县">
            <el-select v-model="searchForm.county" placeholder="请选择" clearable>
              <el-option v-for="county in countyArr" :label=county :value=county></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="leadingout">导出</el-button>
          </el-form-item>
        </el-form>

        <!-- map -->
        <div id="map"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
