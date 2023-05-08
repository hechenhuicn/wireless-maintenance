<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref, reactive, onMounted } from 'vue'
import { bus } from 'vue3-eventbus'
import 'ol/ol.css';
import {Map, View, Feature, Overlay} from 'ol';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Fill, Stroke, Style, Circle} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
// import LayerGroup from 'ol/layer/Group';
import { getAlarmAndProperty, getGIS, exportGISExcel } from '@/api'

let isCollapse = ref(false);//菜单开合标记
let searchForm = reactive({
  layerType: '故障告警',//图层类别
  alarmType: '',//告警类别
  attribute: '',//属性
});
const layerTypeArr = ['故障告警','性能告警','物理站'];//图层类型，固定3类
let alarmAndPropertyObj = reactive({});//告警类型、数据类型对象
let alarmTypeArr = ref([]);//故障/性能告警对应的告警类型，不能用reactive，大概是响应式在赋值时失效了
let propertyTypeArr = ref([]);//属性类型，不能用reactive，大概是响应式在赋值时失效了
let alarmTypedisabled = ref(false);

let map = reactive({}); // 存放地图实例
let geoJSON = reactive({});//告警or物理站marker的原始geoJSON
let vectorLayer = reactive({}); // 标记点的layer
let shopPopup = ref(false);//popup控制标记


onMounted(() => {
  getInitInfo();
  initMap();
})
// 监听菜单开合变动
bus.on('changeExpand', newVal => {
        isCollapse.value = newVal;
    }
)

// 获取search form初始信息
const getInitInfo = async () => {
  let res = await getAlarmAndProperty();
  // console.log('getAlarmAndProperty res', res)
  if (res.status == 200) {
    alarmAndPropertyObj = res.data;
    alarmTypeArr.value = alarmAndPropertyObj.fault_alarm;
    propertyTypeArr.value = alarmAndPropertyObj.attribute;
    // 如alarmTypeArr数组非空，让alarmType设成新类型中第一个值
    if (alarmTypeArr.value.length != 0) {
      searchForm.alarmType= alarmTypeArr.value[0];
    }
  }
  
}
// 查询
const search = async () => {
  // 请求新数据
  let res = await getGIS(searchForm);
  console.log('getGIS res',res)
  if (res.status == 200) {
    // 渲染marker图层
    renderMap(res.data);
  }


  // 点——故障告警/物理站
  // geoJSON = {
  //   features: [
  //     {
  //       geometry: {
  //           coordinates: [121.84059,29.89729],
  //           type: 'Point'
  //         },
  //       properties: {
  //         name: 'N746362宁波北仑丽晶酒店',
  //         network: '4G',
  //         alarm: '小区退服'
  //       },
  //       type: 'Feature'
  //     },
  //     {
  //       geometry: {
  //         coordinates: [121.844848,29.919004],
  //         type: 'Point'
  //       },
  //       properties: {
  //         name: 'N746127宁波北仑得润花园',
  //         network: '4G',
  //         alarm: '时钟告警'
  //       },
  //       type: 'Feature'
  //     },
  //     {
  //       geometry: {
  //         coordinates: [121.913671,29.765101],
  //         type: 'Point'
  //       },
  //       properties: {
  //         name: 'H946132宁波北仑春晓明月湖南FDD',
  //         network: '4G',
  //         alarm: '驻波告警'
  //       },
  //       type: 'Feature'
  //     }
  //   ],
  //   type: 'FeatureCollection'
  // }
  // 渲染marker图层
  // renderMap(geoJSON);
}
// 导出
const leadingout = () => {

}
// 图层类别值变更监听
const layerTypeChange = (val) => {
  // console.log(val)
  switch(val) {
    case '故障告警': 
      alarmTypeArr.value = alarmAndPropertyObj.fault_alarm;
      if (alarmTypeArr.value.length != 0) {
        // 如数组非空，让alarmType设成新类型中第一个值
        searchForm.alarmType= alarmTypeArr.value[0];
      } else {
        // 如数组为空，清空searchForm.alarmType原值
        searchForm.alarmType = '';
      }
      alarmTypedisabled.value=false;
      break;
    case '性能告警': 
      alarmTypeArr.value = alarmAndPropertyObj.performance_alarm;
      if (alarmTypeArr.value.length != 0) {
        searchForm.alarmType= alarmTypeArr.value[0];
      } else {
        searchForm.alarmType = '';
      }
      alarmTypedisabled.value=false;
      break;
    case '物理站':
      alarmTypeArr.value = [];
      // 物理站下alarmType字段是空
      searchForm.alarmType = '';
      alarmTypedisabled.value=true;
      break;
  }
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

// 渲染地图marker图层
const renderMap = (geoJSON) =>{
  // 删除原maker layer
  map.removeLayer(vectorLayer);
  let vectorSource = new VectorSource({
    // features: [new Feature({
    //   geometry: new Point([121.84059,29.89729])
    // })]
    features: (new GeoJSON()).readFeatures(geoJSON)
  });
  vectorLayer = new VectorLayer({
      source: vectorSource, //矢量数据源
      style: styleFunction
  });
  map.addLayer(vectorLayer);
  addPopup();
}

// 加载GEOJSON用的样式函数
const styleFunction = (feature) => {
  let geo = feature.getGeometry().getType();
  // console.log('feature',feature,'geo',geo);
  let style = {}
  switch(geo) {
    case 'Polygon':
      style = new Style({
        stroke: new Stroke({ color: '#ffcc33', width: 2 }),
        fill: new Fill({ color: '#aa3300' }) 
      });
      break;
    case 'Point':
      // 点样式
      style = new Style({
        image: new Circle({
          radius: 5,//feature.get('radius'),
          fill: new Fill({ color: '#ff6200' }), 
          stroke: new Stroke({ color: '#ff9900', width: 2 })
        })
      });
      break;
  }
  return style;
}

// 点击图形出现popup
let addPopup = () => {
  // 使用变量存储弹窗所需的 DOM 对象
  let container = document.getElementById("popup");
  let closer = document.getElementById("popup-closer");
  let content = document.getElementById("popup-content");

  // 创建一个弹窗 Overlay 对象
  let overlay = new Overlay({
      element: container, //绑定 Overlay 对象和 DOM 对象的
      autoPan: false, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
      autoPanAnimation: {
          duration: 250 //自动平移效果的动画时间 9毫秒）
      }
  });
  // 将弹窗添加到 map 地图中
  map.addOverlay(overlay);

  // 为弹窗添加一个响应关闭的函数
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  }

  // 添加单击响应函数来处理弹窗动作
  map.on("singleclick", function(e) {
      //判断当前单击处是否有feature，捕获到要素时弹出popup
      let feature = map.forEachFeatureAtPixel(
        e.pixel,
        (feature) => feature
      );
      console.log('popup feature',feature);
      if (feature) {
        shopPopup.value = true;
        content.innerHTML=`<ul style="text-align:left;">
                            <li class="popup-li"><span class="li-title">告警标题：</span><span>${feature.get('告警标题')}</span></li>
                            <li class="popup-li"><span class="li-title">触发时间：</span><span>${feature.get('触发时间')}</span></li>
                            <li class="popup-li"><span class="li-title">小区名：</span><span>${feature.get('站点名称')}</span></li>
                            <li class="popup-li"><span class="li-title">网络制式：</span><span>${feature.get('net_type')}</span></li>
                            <li class="popup-li"><span class="li-title">CGI：</span><span>${feature.get('CGI')}</span></li>
                            <li class="popup-li"><span class="li-title">区县：</span><span>${feature.get('区县')}</span></li>
                            <li class="popup-li"><span class="li-title">属性：</span><span>${feature.get('vip_lev')}</span></li>
                          </ul>`;
        
        
        overlay.setPosition(e.coordinate); //把 overlay 显示到指定的 x,y坐标
      } else {
        shopPopup.value = false;
      }
  });
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
          <el-form-item label="图层类别">
            <el-select v-model="searchForm.layerType" @change="layerTypeChange">
              <el-option v-for="layer in layerTypeArr" :key="layer" :label="layer" :value="layer" />
            </el-select>
          </el-form-item>
          <el-form-item label="告警类别">
            <el-select v-model="searchForm.alarmType" :disabled="alarmTypedisabled">
              <!-- 要后端反馈 -->
              <el-option v-for="alarm in alarmTypeArr" :key="alarm" :label="alarm" :value="alarm" />
            </el-select>
          </el-form-item>
          <el-form-item label="属性">
            <el-select v-model="searchForm.attribute" placeholder="请选择" multiple collapse-tags collapse-tags-tooltip>
              <!-- 要后端反馈 -->
              <el-option v-for="property in propertyTypeArr" :key="property" :label="property" :value="property" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="leadingout">导出</el-button>
          </el-form-item>
        </el-form>

        <!-- map -->
        <div id="map"></div>

        <!-- popup -->
        <div id="popup" class="ol-popup" v-show="shopPopup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="popup-content"></div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
}
.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}
.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}
.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}
.popup-content {
    width: 300px;
    font-size: 9px;
}
.ol-popup-closer:after {
    content: "✖";
}
.popup-li {
  list-style-type:none;
}
.popup-li .li-title {
  font-weight:bold
}
</style>
