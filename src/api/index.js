import axios from 'axios';
import { ElMessage } from 'element-plus'


axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_API_PATH;


// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 带上token
    if (localStorage.nb_wy_wireless_mes) {
        config.headers.Authorization = 'JWT '+JSON.parse(localStorage.getItem('nb_wy_wireless_mes')).token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 处理excel文件
  if (response.headers && response.headers['content-type'] === 'text/csv') {
    // console.log('进入处理excel文件','response',response)
    const content = response.data
    const blob = new Blob([content]);
    let time = new Date().toLocaleString( );
    let fileName =  `export${time}.csv`;
    let contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      let fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9, contentDisposition.length);
      fileName = window.decodeURI(fileName, "UTF-8");//中文名要乱码，需要指定下编码
    }
    const elink = document.createElement('a')
    // replace是为了下载后自动会给filename加下划线，因a标签download属性是双层双引号导致，此处去掉一层双引号
    elink.download = fileName.replace(new RegExp('"', 'g'), '')
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
    return
  }
    return response;
  }, function (error) {
    switch(error.response.status) {
      case 401:
        // 401 说明 token 验证失败,重新登录获取 token
        location.href = '/login';
        break;
      case 500:
        // 500 服务器错误
        ElMessage.error('服务器错误');
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data);
  });

// 登录
export function login(data) {
    return axios({
        method: 'post',
        url: '/login/',
        data
    });
}

// 获取故障告警、性能告警、属性的值
export function getAlarmAndProperty() {
    return axios({
        method: 'get',
        url: '/api/classification_details/'
    });
}

// 查询GIS
export function getGIS(searchForm) {
  let {layerType, alarmType, attribute} = searchForm;
    return axios({
        method: 'get',
        url: `/api/layer_detail/?layer_style=${layerType}&alarm_type=${alarmType}&attribute=${attribute}`
    });
}

// 导出GIS对应的EXCEL
export function exportGISExcel(searchForm) {
  let {layerType, alarmType, attribute} = searchForm;
    return axios({
        method: 'get',
        url: `/api/layer_download/?layer_style=${layerType}&alarm_type=${alarmType}&attribute=${attribute}`,
        responseType: 'blob'
    });
}

// 请求首页工作台数据
export function getWorkbench() {
  return axios({
      method: 'get',
      url: '/api/screen_district/'
  });
}

// 获取本地宁波地图
export function getNBGeojson() {
  return axios({
      method: 'get',
      // 打包前要修改这个baseURL
      baseURL: 'http://188.103.147.179:30131',
      url: '/json/ningbo.json'
  });
}
// 导出首页工作台的EXCEL
export function exportWorkbenchExcel(exportType) {
    return axios({
        method: 'get',
        url: `/api/ScreenDetail/?alarm_order=${exportType}`,
        responseType: 'blob'
    });
}
// 获取物料对比数据
export function getMeteral(page, page_size, reportSearchForm) {
  let { networkType } = reportSearchForm
  return axios({
      method: 'get',
      url: `/api/material_detail/?page=${page}&page_size=${page_size}&network_type=${networkType}`
  });
}
// 导出物料对比EXCEL
export function exportMeteral(network_type) {
  return axios({
      method: 'get',
      url: `/api/material_download/?network_type=${network_type}`,
      responseType: 'blob'
  });
}