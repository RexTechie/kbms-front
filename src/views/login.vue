<template>
  <div class="page">
    <el-row type="flex" justify="center" align="middle" class="container">
      <el-col :lg="14" :xl="14">
        <el-row class="panel">
          <el-col :span="12" :offset="6">
            <div class="right">
              <div class="title-container">
                <h2>企业知识库管理系统</h2>
              </div>
              <div>
                <div class="row">
                  <el-input
                    v-model="username"
                    placeholder="用户名"
                    prefix-icon="el-icon-user"
                    clearable="clearable"
                    @keydown.enter="login"
                  />
                </div>
                <div class="row">
                  <el-input
                    type="password"
                    v-model="password"
                    placeholder="密码"
                    prefix-icon="el-icon-lock"
                    clearable="clearable"
                    @keydown.enter="login"
                  />
                </div>
                <div class="row">
                  <el-button type="primary" class="btn"
                            @click="login"
                    >登陆系统</el-button
                  >
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "element-plus/lib/theme-chalk/display.css";
import { ElMessage } from "element-plus";
import router from "../router/index.js";
import { isUsername, isPassword } from "../utils/validate.js";
export default {
  data: function () {
    return {
      username: null,
      password: null,
      uuid: null,
    };
  },
  methods: {
    login() {
      let that = this;
      let data = {
        username: that.username,
        password: that.password
      };
      //发送登陆请求
      that.$http("/login", "POST", data, true, function (resp) {
        console.log(resp);
        if (resp.code == 200) {
          //在浏览器的storage中存储用户权限列表，这样其他页面也可使用storage中的数据，实现共享
          let role = resp.data.role;
          //取出Token令牌，保存到storage中
          let token = resp.data.token;
          localStorage.setItem("role", role);
          localStorage.setItem("token", token);
          //让路由跳转页面，这里的Home是home.vue页面的名字
          router.push({ name: "Home" });
        } else {
          ElMessage.error({
            message: resp.msg,
            duration: 1200,
          });
        }
      });
    },
    keyDown(e){
      if (e.keyCode === 13) {
        this.login();
      }
    }
  },
  created() {
  },
};
</script>

<style lang="less" scoped="scoped">
@import url("login.less");
</style>
