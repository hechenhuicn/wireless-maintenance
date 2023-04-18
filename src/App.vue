<script setup>

// 设置title
document.title = '无线维护';
// 主色对应的其他颜色
const mix = (color1, color2, weight) => {
  weight = Math.max(Math.min(Number(weight), 1), 0)
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)
  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
  const _r = ('0' + (r || 0).toString(16)).slice(-2)
  const _g = ('0' + (g || 0).toString(16)).slice(-2)
  const _b = ('0' + (b || 0).toString(16)).slice(-2)
  return '#' + _r + _g + _b
}
// 修改主题色
document.body.style.setProperty('--el-color-primary', '#5E7199')
for (let i = 1; i <= 9; i ++) {
    document.body.style.setProperty(`--el-color-primary-light-${i}`, mix('#5E7199','#FFFFFF',0.1*i))
    // console.log(mix('#5E7199','#FFF',0.1*i))
}
// 点击button使用的类
document.body.style.setProperty(`--el-color-primary-dark-2`, '#525C73')

</script>

<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<style>
html, body {
    margin: 0;
    padding: 0;
}
body {
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    font-size: 15px;
    display: inline;
}
#app {
    padding: 0;
    max-width: 5000px;
}
/* menu动画关闭后加到aside上 */
.el-aside {
    transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -o-transition: width 0.15s;
}
/* login页面form内容居中 */
.form-container .el-form-item .el-form-item__content{
    justify-content: center;
}
</style>
