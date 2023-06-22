<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { bus } from 'vue3-eventbus'

let isCollapse = ref(false);//菜单开合标记

onMounted(() => {
  // 监听菜单开合变动
  bus.on('changeExpand', changeStyle);
})
// 在组件卸载之前移除监听
onBeforeUnmount( () => {
  bus.off('changeExpand', changeStyle);
})
// 菜单开合变动时候修改对应样式
const changeStyle = (newVal) => {
  isCollapse.value = newVal;
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
</style>
