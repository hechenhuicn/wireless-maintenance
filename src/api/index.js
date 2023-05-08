import axios from 'axios';
import { ElMessage } from 'element-plus'


axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_API_PATH;


// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 带上token
    if (localStorage.wireless_maintenance_mes) {
        config.headers.Authorization = JSON.parse(localStorage.getItem('wireless_maintenance_mes')).token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// 响应拦截器
axios.interceptors.response.use(function (response) {
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
        url: '/classification_details/'
    });
}

// 查询GIS
export function getGIS(searchForm) {
  let {layerType, alarmType, attribute} = searchForm;
    return axios({
        method: 'get',
        url: `/layer_detail/?layer_style=${layerType}&alarm_type=${alarmType}&attribute=${attribute}`
    });
}

// 导出GIS对应的EXCEL
export function exportGISExcel() {
    return axios({
        method: 'get',
        url: '/other/'
    });
}