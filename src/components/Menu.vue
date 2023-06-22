<script setup>
import { ref } from 'vue'
import { Monitor, MapLocation, Memo } from '@element-plus/icons-vue'
import { bus } from 'vue3-eventbus'
import { useRoute } from 'vue-router'

let isCollapse = ref(false);//菜单开合标记
const route = useRoute()
// 监听菜单开合变动
bus.on('changeExpand', newVal => {
        isCollapse.value = newVal;
    }
)

// const imgUrl = new URL('../assets/images/logomenu.png',import.meta.url).href;

</script>

<template>
    <!-- 导航菜单 -->
    <el-menu
        class="menu-bar"
        :default-active="route.path"
        router
        :collapse="isCollapse"
        background-color="#5E7199"
        text-color="#fff"
        active-text-color="#fff"
        :collapse-transition="false">
        <div class="logo-item">
            <div>
                <span class="logo-name-big" v-show="!isCollapse">网优维护</span>
                <span class="logo-name-small" v-show="isCollapse">网优维护</span>
                <!-- <el-avatar :src="imgUrl" size="medium"></el-avatar> -->
            </div>
        </div>
        <el-menu-item index="/">
            <el-icon><Monitor /></el-icon>
            <template #title>监控大屏</template>
        </el-menu-item>
        <el-menu-item index="/map">
            <el-icon><MapLocation /></el-icon>
            <template #title>告警GIS</template>
        </el-menu-item>
        <el-sub-menu index="/report">
            <template #title>
                <el-icon><Memo /></el-icon>
                <span>数据健康度</span>
            </template>
            <el-menu-item index="/report/material">物料核查</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<style scoped>
.menu-bar{
    height: 100vh;
}
.el-menu-item.is-active {
      font-weight: bold;
      background-color: rgb(75, 90, 122);
  }
.logo-item {
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-weight: bold;
    
}
.logo-item .logo-name-big {
    font-size: 28px;
}
.logo-item .logo-name-small {
    font-size: 10px;
}
</style>