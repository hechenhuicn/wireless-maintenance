<script setup>
import Menu from "@/components/Menu.vue"
import Header from "@/components/Header.vue"
import { ref } from 'vue'
import { bus } from 'vue3-eventbus'

let isCollapse = ref(false);//菜单开合标记
// 监听菜单开合变动
bus.on('changeExpand', newVal => {
        isCollapse.value = newVal;
    }
)


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
        
        <div>report content</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
</style>
