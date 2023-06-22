<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { login } from '@/api'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const loginFormRef = ref(null) //表单元素

let loginForm = reactive({
    username: '',//用户名
    password: '',//密码
})
// 验证规则
const rules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password:[{ required: true, message: '密码不能为空', trigger: 'blur' }],
})

onMounted(() => {
  keyupEnter();
})

// 登录请求
const submitForm = () => {
  proxy.$refs.loginFormRef.validate(async (valid) => {
      try {
          if (valid) {
              let res = await login(loginForm);
              // console.log('login res',res);
              if(res.status == 200) {
                // 用户名、密码正确
                let obj = {
                  'username': loginForm.username,
                  'token': res.data.token,
                  'expires': 12 * 60 * 60 * 1000,//ms，12小时
                  'startTime': new Date().getTime()//记录何时将值存入缓存，毫秒级
                }
                localStorage.setItem('nb_wy_wireless_mes', JSON.stringify(obj));
                proxy.$router.push({name: 'home'});
              } else {
                // 用户名或密码错误
                console.log('res', res);
                ElMessage.error(res);
              }
          }
      } catch(e) {
          console.log('catch这里',e);
          ElMessage.error(e);
      }
  });
}

// 监听enter事件，登录按钮需要获取焦点才能用@keyup.enter.native，所以绑到了document上
const keyupEnter = () => {
    // let self = this;
    document.onkeydown = function(e) {
        // These attributes are deprecated
        // let key = e.which || e.keyCode;
        let key = e.key;
        if (key == 'Enter') {
            submitForm();
        }
    }
}

</script>

<template id="login-wrap-father">
    <div id="login-wrap">
      <div class="form-container">
        <a class="logo" href="javascript:void(0)"></a>
        <!-- <h1>网优维护</h1> -->

        <el-form :model="loginForm" :rules="rules" status-icon ref="loginFormRef">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码"/>
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
    background: url("../../assets/images/loginlogo.png") no-repeat center;
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