<script setup>
import { ref } from 'vue'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import { bus } from 'vue3-eventbus'

let isCollapse = ref(false);//菜单开合标记，true折叠，false展开
let nameHover = ref(false);//用户名是否hover标记
let liHover = ref(false);//popover是否hover标记
let username = ref('wangyou');//用户名


// 改变menu开合状态
const change = () => {
    isCollapse.value = !isCollapse.value;
    bus.emit('changeExpand', isCollapse.value)
}
// 用户注销
const exit = () => {

}
</script>

<template>
    <el-header>
        <!-- hamburger按钮 -->
        <div class="hamburger-container">
            <el-icon v-show="!isCollapse" @click="change"><Fold /></el-icon>
            <el-icon v-show="isCollapse" @click="change"><Expand /></el-icon>
        </div>

        <!-- 右侧用户名 -->
        <div class="user">
            <div class="name-item"  :class="{'name-item-hover':nameHover}" @mouseover="nameHover=true;" @mouseleave="nameHover=false">
                <span class="username">{{username}}</span>
                <el-icon><ArrowDown /></el-icon>
            </div>

            <ul class="popover-item" :class="{'open':nameHover}">
                <router-link to="/login" @click="exit">
                    <li :class="{'popover-item-hover':liHover}" @mouseover="liHover=true;nameHover=true;" @mouseleave="liHover=false;nameHover=false">
                        <span>注销</span>
                    </li>
                </router-link>
            </ul>
        </div>
    </el-header>
</template>

<style scoped>
.el-header {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    padding: 0;
    z-index: 1000;
}
.hamburger-container {
    float: left;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    font-size: 20px
}
.hamburger-container .el-icon {
    width: 1.2em; 
    height: 1.2em;
    padding: 2px 5px;
    color: #606266
}
.hamburger-container .el-icon:hover {
    color: #888
}
.user {
    float: right;
}
.name-item {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    color: #606266;
    cursor: pointer;
}
  /* hover时候的样式 */
.name-item-hover, .popover-item-hover{
    background-color: #f2f2f2;
}
.username {
    margin-right: 5px;
}
.popover-item {
    margin: 0;
    padding: 0;
    background-color: white;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    position: absolute;
    z-index: 1000;
    display: none;
}
.popover-item.open {
    display: block;
}
.popover-item li {
    width: 52px;
    list-style: none;
    padding: 8px 18px;
    text-align: center;
    font-size: 14px;
    z-index: 2000;
}
.popover-item a {
    color:#606266;
    text-decoration:none; 
}
</style>