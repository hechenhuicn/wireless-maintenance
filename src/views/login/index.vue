<script setup>
import { reactive } from 'vue'

let loginForm = reactive({
    username: '',
    password: '',
})
let rules = reactive({

})
// 登录请求
const submitForm = () => {
    console.log('点击了登录')
}

</script>

<template id="login-wrap-father">
    <div id="login-wrap">
      <div class="form-container">
        <!-- <a class="logo" href="javascript:void(0)"></a> -->
        <h1>LOGO</h1>
        <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<style scoped>
#login-wrap-father {
    position: relative;
}
#login-wrap{
    min-width: 100vw;
    min-height: 100vh;
    background: url("../../assets/images/DarkSkies.jpg") no-repeat center;
}
.logo {
    display: block;
    margin: 0 auto;
    height: 100px;
    /* background: url("../../assets/images/loginlogo.png") no-repeat center; */
    background-size: contain;
  }
.form-container {
    width: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    background-color:rgba(255, 255, 255,0.3);
    border-radius: 4px;
    padding: 25px 40px;
}
.form-container .el-form {
    margin-top: 50px;
}
button {
    width: 90%;
}
</style>